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
    public class AgentController : ControllerBase
    {
        IAgentService _agentService;
        IUserProfile Identity => this.HttpContext.User.GetUserAccount();
        public AgentController(IAgentService agentService)
        {
            _agentService = agentService;
        }

        [HttpPost]
        [Route("agents")]
        public async Task<PagedCollection<AgentDto>> GetAgents(BaseFilter filter)
        {
             return await _agentService.GetAgents(filter);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetAgent(Guid id)
        {
            var agent = await _agentService.GetAgent(id);
            if (agent == null)
                throw new NotFoundCustomException("Cannot find agent");

            return Ok(agent);
        }


        [HttpPost]
        [Route("SaveAgent")]
        public async Task<AgentDto> SaveAgent(AgentDto agentDto)
        {
            return await _agentService.SaveAgent(agentDto, Identity);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteAgent(Guid id)
        {
            await _agentService.DeleteAgent(id, Identity);
            return Ok("Deleted");
        }
    }
}
