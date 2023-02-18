using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.LMS.Platform.Core.Services.Interfaces;
using Yokogawa.Security.OAuth.Identity;
using Yokogawa.Security.OAuth.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace Yokogawa.LMS.Platform.Web.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        IRoleService _roleService;
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
        public RolesController(IRoleService roleService)
        {
            _roleService = roleService;
            
        }

        [Route("{websiteId}")]
        public async Task<IEnumerable<RoleDto>> GetRoles(Guid websiteId)
        {
            return await _roleService.GetRoles(Identity, websiteId);
        }

        //[Route("role")]
        [Route("{websiteId}/{id}")]
        public async Task<RoleDto> GetRole(Guid id,Guid websiteId)
        {
            return await _roleService.GetRole(id,websiteId, Identity);
        }

        [HttpPost]
        //[Route("role")]
        public async Task<RoleDto> PostRole(RoleDto role)
        {
            return await _roleService.SaveRole(role, Identity);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteRole(Guid id)
        {
            await _roleService.DeleteRole(id, Identity);
            return Ok();
        }

        [HttpDelete]
        [Route("userroles/{roleId}")]
        public async Task<IEnumerable<UserDto>> RemoveAllUsersFromRole(Guid roleId)
        {
            await _roleService.RemoveUsersFromRole(roleId, Identity);
            return new List<UserDto>();
        }

        [HttpDelete]
        [Route("userroles")]
        public async Task<IEnumerable<UserDto>> RemoveUserFromRole(Guid roleId,string userId)
        {
            await _roleService.RemoveUserFromRole(roleId, userId, Identity);
            return await _roleService.GetUserRoles(roleId, Identity);
        }

        [Route("normalroles/{websiteId}")]
        public async Task<IEnumerable<RoleDto>> GetRolesForMenu(Guid websiteId)
        {
            return await _roleService.GetRolesWithoutAdmin(websiteId, Identity);
        }
    }
}
