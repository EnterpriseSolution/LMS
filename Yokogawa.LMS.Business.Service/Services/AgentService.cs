using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Exceptions;
using Yokogawa.LMS.Business.Services.Interfaces;
using Yokogawa.LMS.Business.Data;
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.LMS.Business.Data.Entities;
using Yokogawa.LMS.Business.Service.Projections;
using Yokogawa.LMS.Business.Data.Commands;
using Yokogawa.Data.Infrastructure.DTOs;

namespace Yokogawa.LMS.Business.Services
{
    public class AgentService : IAgentService
    {
        private LMSDBContext _dbContext;
        private readonly ILogger<AgentService> _logger;
        public AgentService(LMSDBContext dbContext, ILogger<AgentService> logger) 
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<PagedCollection<AgentDto>> GetAgents(IFilter filter)
        {
            return await _dbContext.Agents.ExcludeDeletion().AsNoTracking().GetQuery(filter)
                                          .Select<Agent, AgentDto>(AgentProjection.AgentDto)
                                          .ToPagedCollectionAsync(filter);

        }

        public async Task<AgentDto> GetAgent(Guid id)
        {
            AgentDto agent = id == Guid.Empty ? new AgentDto() { } : null;
            agent = agent ?? await _dbContext.Agents.GetById(id).ExcludeDeletion().Select(AgentProjection.AgentDto).FirstOrDefaultAsync<AgentDto>();
            
            if (agent == null)
                throw new NotFoundCustomException("Record is not found");

            return agent;
        }

        public async Task<AgentDto> SaveAgent(AgentDto agentDto, IUserProfile profile)
        {
            var agent = await _dbContext.Agents.CreateOrUpdateAsync(agentDto, profile);
            await _dbContext.SaveChangesAsync();
            agentDto.Id = agent.Id;
            return agentDto;
        }

        public async Task DeleteAgent(Guid id, IUserProfile user)
        {
            var result = await _dbContext.Agents.DeleteAsync(id, user);
            if (result == null)
                return;

            await _dbContext.SaveChangesAsync();
        }
    }
}
 