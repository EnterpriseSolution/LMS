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
    public static class JettyCommands
    {
        public static async Task<Jetty> ValidatePermissionAsync(this DbSet<Jetty> dbSet, Guid id)
        {
            Jetty entity = await dbSet.GetById(id).FirstOrDefaultAsync();

            return entity;
        }

        public static async Task ValidateAsync(this DbSet<Jetty> dbSet, IJettyDto dto)
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

        public static async Task<Jetty> CreateOrUpdateAsync(this DbSet<Jetty> dbSet, IJettyDto dto, IUserProfile profile)
        {
            dto.SetAudit(profile.UserId, profile.UserName);
            var jetty = await dbSet.ValidatePermissionAsync(dto.Id);
            bool isCreate = jetty == null;

            if (isCreate)
            {
                jetty = new Jetty();
                jetty.Id = Guid.NewGuid();
                dbSet.Add(jetty);
            }
            await dbSet.ValidateAsync(dto);

            jetty.JettyNo = dto.JettyNo;
            jetty.LOA = dto.LOA;
            jetty.Displacement = dto.Displacement;
            jetty.MaxDraft = dto.MaxDraft;
            jetty.ManifoldHeight = dto.ManifoldHeight;
            jetty.CommissionDate = dto.CommissionDate;
            jetty.Status = dto.Status;
            jetty.Remarks = dto.Remarks;
            jetty.SetAudit(dto, isCreate, true);

            return jetty;
        }

        public static async Task<Jetty> DeleteAsync(this DbSet<Jetty> dbSet, Guid id, IUserProfile profile)
        {
            var jetty = await dbSet.ValidatePermissionAsync(id);
            bool isDeleted = jetty != null;
            if (isDeleted)
                jetty.LogicDelete(profile.UserId, profile.UserName, false);

            return jetty;
        }
    }
}
