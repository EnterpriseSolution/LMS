using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.LMS.Platform.Core.Services.Interfaces;
using Yokogawa.Security.OAuth.Identity;
using Microsoft.AspNetCore.Authorization;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.LMS.Platform.Web.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class WebsitesController : ControllerBase
    {
        IWebsiteService _websiteService;
        IUserProfile _identity;
        IUserProfile Identity
        {
            get
            {
                if (_identity == null)
                    _identity = this.HttpContext.User.GetUserAccount();
                return _identity;
            }
        }
        public WebsitesController(IWebsiteService websiteService) {
            _websiteService = websiteService;
        }

        
        public async Task<IEnumerable<WebsiteDto>> GetWebsites()
        {
            if (!Identity.RoleIds.Contains(PredefinedValues.AdminRoleId.ToString()))
                return new List<WebsiteDto>();

            return await _websiteService.GetWebsites();
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetWebsite(Guid id)
        {
            var website = await _websiteService.GetWebsite(id,Identity);
  
            return Ok(website);
        }

        [HttpPost]
        //[Route("website")]
        public async Task<IActionResult> PostWebsite(WebsiteDto websiteDto)
        {
            var website = await _websiteService.SaveWebsite(websiteDto, Identity);
            return Ok(website);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteWebsite(Guid id)
        {
            await _websiteService.DeleteWebsite(id, Identity);
            return Ok("Deleted");
        }
    }
}