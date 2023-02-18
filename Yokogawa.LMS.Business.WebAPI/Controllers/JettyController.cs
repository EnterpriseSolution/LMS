using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Business.Data.DTOs;
using Yokogawa.LMS.Business.Services.Interfaces;
using Yokogawa.LMS.Exceptions;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.Security.OAuth.Identity;
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.Data.Infrastructure.DTOs;

namespace Yokogawa.LMS.Business.WebAPI
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class JettyController : ControllerBase
    {
        IJettyService _jettyService;
        IUserProfile Identity => this.HttpContext.User.GetUserAccount();
        public JettyController(IJettyService jettyService)
        {
            _jettyService = jettyService;
        }

        [HttpPost]
        [Route("jetties")]
        public async Task<PagedCollection<JettyDto>> GetJetties(BaseFilter filter)
        {
            return await _jettyService.GetJetties(filter);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetJetty(Guid id)
        {
           var jetty = await _jettyService.GetJetty(id);

            return Ok(jetty);
        }

        [HttpPost]
        [Route("SaveJetty")]
        public async Task<JettyDto> SaveJetty(JettyDto jettyDto)
        {
            return await _jettyService.SaveJetty(jettyDto, Identity);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteJetty(Guid id)
        {
            await _jettyService.DeleteJetty(id, Identity);
            return Ok("Deleted");
        }
    }
}
