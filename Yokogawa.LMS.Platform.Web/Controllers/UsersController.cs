using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.LMS.Platform.Core.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Yokogawa.Security.OAuth.Identity;
using System.Security.Claims;
using Newtonsoft.Json;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Exceptions;

namespace Yokogawa.LMS.Platform.Web.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        IUserService _userService;
        IUserProfile _identity;
        IUserProfile Identity {
            get
            {
               if (_identity == null)
                    _identity = this.HttpContext.User.GetUserAccount();
                return _identity;
            }
        }
        public UsersController(IUserService userService)
        {
            _userService = userService;
            
        }

        [HttpGet]
        [Route("profile")]
        public async Task<IUserDto> GetUserProfile()
        {
            var profile = this.HttpContext.User.GetUserProfile();
            var strMFSettings = profile[CustomClaimTypes.MFAProviders].ToString();
            var userOTPSettings = JsonConvert.DeserializeObject<List<MFASettingDto>>(strMFSettings);

            UserDto user = new UserDto()
            {
                UserId = profile[CustomClaimTypes.UserId].ToString(),
                DisplayName = profile[CustomClaimTypes.DisplayName].ToString(),
                Email = profile[ClaimTypes.Email].ToString(),
                Domain = profile[CustomClaimTypes.Domain].ToString(),
                Company = profile[CustomClaimTypes.Company].ToString(),
                RoleIds = profile[ClaimTypes.Role]==null? new List<string>(): (List<string>)profile[ClaimTypes.Role],
                SFASettings = userOTPSettings.ToList<MFASettingDto>()
            };

            user = await _userService.GetUserProfile(user);
            return user;

        }

        [HttpDelete]
        [Route("signout/{clientId}")]
        public async Task Signout(string clientId)
        {
            var user = this.HttpContext.User.GetUserAccount();

            if (user != null)
                await _userService.Signout(user.UserId, clientId);
        }

        [Route("users/{websiteId}")]
        public async Task<IEnumerable<IUserDto>> GetUsers(Guid websiteId)
        {
            BaseFilter filter = new BaseFilter();
            return await _userService.GetUsers(Identity, websiteId, filter);
        }

        [Route("externalusers/{websiteId}")]
        public async Task<IEnumerable<IUserDto>> GetADUsers(Guid websiteId)
        {
            BaseFilter filter = new BaseFilter();
            return await _userService.GetExternalUsers(Identity, websiteId,filter);
        }

        [HttpGet]
        [Route("user")]
        public async Task<IActionResult> GetUser(Guid id,Guid websiteId)
        {
            var user = await _userService.GetUser(id,websiteId,Identity);
            if (user == null)
                throw new NotFoundCustomException("Cannot find user");

            return Ok(user);
        }

        [HttpGet]
        [Route("externaluser")]
        public async Task<IActionResult> GetExternalUser(Guid id, Guid websiteId)
        {
            var user = await _userService.GetExternalUser(id, websiteId, Identity);

            if (user == null)
                throw new NotFoundCustomException("Cannot find user");

            return Ok(user);
        }


        [Route("website")]
        public async Task<IActionResult> GetPortal(Guid websiteId)
        {
            var user = this.HttpContext.User.GetUserAccount();
            var result = await _userService.GetPortal(websiteId,user);
            return Ok(result);
        }

        [Route("contacts")]
        public async Task<IEnumerable<Contact>> GetContacts()
        {
            return await _userService.GetContacts(Identity.UserId);
        }

        [HttpGet]
        [Route("contact/{id}")]
        public async Task<Contact> GetContact(Guid id)
        {
            var contact =  await _userService.GetContact(id, Identity.UserId);

            if (contact == null)
                throw new NotFoundCustomException("Cannot find contact");

            return contact;

        }

        [HttpDelete]
        [Route("contact/{id}")]
        public async Task<IActionResult> DeleteContact(Guid id)
        {
            await _userService.DeleteContact(id, Identity.UserId);
            return Ok("Deleted");
        }

        [Route("contact")]
        public async Task<Contact> PostContact(Contact contact) {

            var result = await _userService.SaveContact(contact);
            return result;
        }


        [HttpDelete]
        [Route("user/{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            await _userService.DeleteUser(id, Identity);
            return Ok("Deleted");
        }

        [HttpDelete]
        [Route("externaluser/{id}")]
        public async Task<IActionResult> DeleteExternalUser(Guid id)
        {
            await _userService.DeleteExternalUser(id, Identity);
            return Ok("Deleted");
        }

        [HttpPost]
        [Route("user")]
        public async Task<UserDto> PostUser(UserDto user)
        {
            return await _userService.SaveUser(user, Identity);
        }

        [HttpPost]
        [Route("externaluser")]
        public async Task<UserDto> PostExternalUser(UserDto user)
        {
            return await _userService.SaveExternalUser(user, Identity);
        }

        [HttpPost]
        [Route("newsecret")]
        public async Task<MFASettingDto> GenerateUserSecret(MFASettingDto settingDto)
        {
            return await _userService.GenerateSecret(settingDto, Identity);

        }

        [Route("organizations/{websiteId}")]
        public async Task<IEnumerable<OrganizationDto>> GetOrganizations(Guid websiteId) {
            return await _userService.GetOrganizations(websiteId);
        }

        [Route("searchUsers")]
        public async Task<IEnumerable<IUserProfile>> SearchUsers(string locationId,string fieldType,string fieldValue)
        {
            IEnumerable<UserDto> userList;
            if (locationId.Contains("-"))
            {
                Guid websiteId = Guid.Parse(locationId);
                userList = await _userService.SearchUsersInOrganization(websiteId, fieldType, fieldValue);
            }
            else {
                int domainId = Convert.ToInt32(locationId);
                userList= await _userService.SearchADUserAsync(domainId, fieldType, fieldValue);
            }

            if (userList == null)
                return new List<UserProfile>();
            else
                return userList.Select<UserDto, UserProfile>(o=>new UserProfile() { 
                    UserId = o.UserId,
                    UserName = o.DisplayName,
                    Email = o.Email,
                    Company = o.Company
                });
        }

        [Route("changePassword")]
        public async Task ChangePassword(UserDto user) {
            string userId = this.HttpContext.User.Identity.Name;
            if (userId.ToLower() != user.UserId.ToLower())
                throw new BaseCustomException("action is not allowed", Convert.ToInt32(System.Net.HttpStatusCode.Forbidden));

            bool isCompleted = await _userService.ChangePassword(user.UserId, user.Password, user.NewPassword,user.Domain);

            if (!isCompleted)
                throw new BaseCustomException("action is not allowed", Convert.ToInt32(System.Net.HttpStatusCode.Forbidden));
        }
    }
}
