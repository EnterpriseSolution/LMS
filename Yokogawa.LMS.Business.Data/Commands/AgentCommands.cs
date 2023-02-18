using System;
using System.Text;
using System.Linq;
using Yokogawa.Data.Infrastructure.Extensions;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Yokogawa.LMS.Business.Data.DTOs;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.LMS.Exceptions;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Business.Data.Entities;
using System.Collections.Generic;

namespace Yokogawa.LMS.Business.Data.Commands
{
    public static class AgentCommands
    {
        public static async Task<Agent> ValidatePermissionAsync(this DbSet<Agent> dbSet, Guid id)
        {
            Agent entity = await dbSet.GetById(id).FirstOrDefaultAsync();

            return entity;
        }

        public static async Task ValidateAsync(this DbSet<Agent> dbSet, IAgentDto dto)
        {
            StringBuilder sb = new StringBuilder();
            List<Guid> RestIdList = await dbSet.ExcludeDeletion().AsNoTracking().Where(o => o.Id != dto.Id && dto.Id != Guid.Empty).Select(p => p.Id).ToListAsync();
            if (dto.Id != Guid.Empty && RestIdList.Contains(dto.Id))
            {
                sb.AppendLine("Duplicate Record");
            }
            if (sb.Length > 0)
                throw new ConflictException(sb.ToString());
        }

        public static async Task<Agent> CreateOrUpdateAsync(this DbSet<Agent> dbSet, IAgentDto dto, IUserProfile profile)
        {
            dto.SetAudit(profile.UserId, profile.UserName);
            var agent = await dbSet.ValidatePermissionAsync(dto.Id);
            bool isCreate = agent == null;

            if (isCreate)
            {
                agent = new Agent();
                agent.Id = Guid.NewGuid();
                dbSet.Add(agent);
            }
            await dbSet.ValidateAsync(dto);

            agent.AgentName = dto.AgentName;
            agent.AgentCode = dto.AgentCode;
            agent.AgentCRNo = dto.AgentCRNo;
            agent.Address = dto.Address;
            agent.Country = dto.Country;
            agent.PersonInCharge = dto.PersonInCharge;
            agent.Mobile = dto.Mobile;
            agent.PhoneO = dto.PhoneO;
            agent.BillingAddress = dto.BillingAddress;
            agent.BillingCountry = dto.BillingCountry;
            agent.BillTelephone = dto.BillTelephone;
            agent.Status = dto.Status;
            agent.Remarks = dto.Remarks;
            agent.SetAudit(dto, isCreate, true);

            return agent;
        }

        public static async Task<Agent> DeleteAsync(this DbSet<Agent> dbSet, Guid id, IUserProfile profile)
        {
            var agent = await dbSet.ValidatePermissionAsync(id);
            bool isDeleted = agent != null;
            if (isDeleted)
                agent.LogicDelete(profile.UserId, profile.UserName, true);

            return agent;
        }
    }
}
