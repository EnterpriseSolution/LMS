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

namespace Yokogawa.LMS.Platform.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardsController : ControllerBase
    {
        IDashboardService _dashboardService;
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
        public DashboardsController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [Route("{websiteId}")]
        public async Task<IEnumerable<DashboardDto>> GetDashboards(Guid websiteId)
        {
            return await _dashboardService.GetDashboards(websiteId, Identity);
        }

        [HttpGet]
        [Route("{websiteId}/{id}")]
        public async Task<DashboardDto> GetDashboard(Guid id, Guid websiteId)
        {
            return await _dashboardService.GetDashboard(id,websiteId,Identity);
        }

        [HttpPost]
        //[Route("dashboard")]
        public async Task<DashboardDto> PostDashboard(DashboardDto dashboard)
        {
            return await _dashboardService.SaveDashboard(dashboard, Identity);
        }

        [Route("views/{websiteId}")]
        public async Task<IEnumerable<ViewDto>> GetViews(Guid websiteId)
        {
            return await _dashboardService.GetViews(websiteId,Identity);
        }

        [HttpGet]
        [Route("view/{websiteId}/{id}")]
        public async Task<ViewDto> GetView(Guid id,Guid websiteId)
        {
            return await _dashboardService.GetView(id,websiteId,Identity);
        }

        [HttpPost]
        [Route("view")]
        public async Task<ViewDto> PostView(ViewDto view)
        {
            return await _dashboardService.SaveView(view, Identity);
        }

        [HttpDelete]
        [Route("view/{id}")]
        public async Task<IActionResult> DeleteView(Guid id)
        {
            await _dashboardService.DeleteView(id,Identity);
            return Ok();
        }


        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteDashboard(Guid id)
        {
            await _dashboardService.DeleteDashboard(id,Identity);
            return Ok();
        }

        [HttpPost]
        [Route("publish")]
        public async Task<bool> PublishDashboard([FromBody] dynamic data) {
            Guid id = Guid.Parse(data.id);
            return await _dashboardService.PublicDashboard(id, Identity);

        }
    }
}