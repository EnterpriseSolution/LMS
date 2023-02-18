using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.Data.Infrastructure.DTOs;

namespace Yokogawa.LMS.Business.Services.Interfaces
{
    public interface IAgentService
    {
        Task<PagedCollection<AgentDto>> GetAgents(IFilter filter);
        Task<AgentDto> GetAgent(Guid id);
        Task<AgentDto> SaveAgent(AgentDto jetty, IUserProfile user);
        Task DeleteAgent(Guid id, IUserProfile user);
    }
}
