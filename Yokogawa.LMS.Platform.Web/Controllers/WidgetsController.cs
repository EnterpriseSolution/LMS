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
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.LMS.Platform.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WidgetsController : ControllerBase
    {
        IWidgetService _widgetService;
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
        public WidgetsController(IWidgetService widgetService) {
            _widgetService = widgetService;
        }

        [HttpGet]
        [Route("{websiteId}")]
        public async Task<IEnumerable<WidgetDto>> GetWidgetList(Guid websiteId)
        {
            return await _widgetService.GetWidgetList(Identity, websiteId);
        }


        [HttpGet]
        [Route("{websiteId}/{id}")]
        public async Task<WidgetDto> GetWidget(Guid id,Guid websiteId)
        {
            return await _widgetService.GetWidget(id,websiteId, Identity);
        }

        [HttpGet]
        public async Task<WidgetDto> GetWidgetByName(string name,Guid websiteId)
        {
            return await _widgetService.GetWidgetByName(name, websiteId, Identity);
        }

        [HttpPost]
        public async Task<WidgetDto> PostWidget(WidgetDto widget)
        {
            return await _widgetService.SaveWidget(widget, Identity);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteWidget(Guid id)
        {
            await _widgetService.DeleteWidget(id, Identity);
            return Ok();
        }

    }
}