using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.LMS.Platform.Core.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Yokogawa.Security.OAuth.Identity;
using System.Security.Claims;
using Newtonsoft.Json;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.LMS.Platform.Web.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MenusController : ControllerBase
    {
        IMenuService _menuService;
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
        public MenusController(IMenuService menuService) {
            _menuService = menuService;
        }

        [Route("list/{websiteId}")]
        public async Task<IEnumerable<MenuDto>> GetMenus(Guid websiteId)
        {
            return await _menuService.GetMenuList(websiteId, Identity);
        }

        [HttpGet]
        [Route("{websiteId}/{id}")]
        public async Task<MenuDto> GetMenu(Guid id,Guid websiteId)
        {
            return await _menuService.GetMenu(id,websiteId, Identity);
        }

        [HttpPost]
        public async Task<MenuDto> PostMenu(MenuDto menu)
        {
            return await _menuService.SaveMenu(menu, Identity);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteMenu(Guid id)
        {
            await _menuService.DeleteMenu(id, Identity);
            return Ok();
        }
    }
}