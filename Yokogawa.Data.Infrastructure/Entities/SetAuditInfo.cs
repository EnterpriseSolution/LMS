using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities.Base;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Data.Infrastructure.DTOs;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using Yokogawa.Data.Infrastructure.Extensions;


namespace Yokogawa.Data.Infrastructure.Entities
{
    public static class SetAuditInfo
    {

        public static void ForNew(this IAuditable entity, IAuditableDto dto,bool isUtc=false)
        {
            entity.CreatedBy= dto.LastModifiedBy;
            entity.CreatedOn = isUtc? DateTime.UtcNow:DateTime.Now;
            //entity.CreatedByName = dto.LastModifiedByName;
        }

        public static void ForModify(this IAuditable entity, IAuditableDto dto,bool isUtc=false)
        {
            entity.UpdatedBy = dto.LastModifiedBy;
            entity.UpdatedOn = isUtc ? DateTime.UtcNow : DateTime.Now;
            //entity.UpdatedByName = dto.LastModifiedByName;
        }

        public static void ForNew(this IAuditableExtension entity, IAuditableDto dto, bool isUtc = false)
        {
            entity.CreatedBy = dto.LastModifiedBy;
            entity.CreatedOn = isUtc ? DateTime.UtcNow : DateTime.Now;
            entity.CreatedByName = dto.LastModifiedByName;
        }

        public static void ForModify(this IAuditableExtension entity, IAuditableDto dto, bool isUtc = false)
        {
            entity.UpdatedBy = dto.LastModifiedBy;
            entity.UpdatedOn = isUtc ? DateTime.UtcNow : DateTime.Now;
            entity.UpdatedByName = dto.LastModifiedByName;
        }
        public static void SetAudit(this IAuditable entity, IAuditableDto dto, bool isCreated = false,bool isUtc=false)
        {
            if (isCreated)
            {
                entity.CreatedBy = dto.LastModifiedBy;
                entity.CreatedOn = isUtc ? DateTime.UtcNow : DateTime.Now;
                //entity.CreatedByName = dto.LastModifiedByName;
            }
            else
            {
                entity.UpdatedBy= dto.LastModifiedBy;
                entity.UpdatedOn = isUtc ? DateTime.UtcNow : DateTime.Now;
                //entity.UpdatedByName = dto.LastModifiedByName;
            }
        }
        public static void SetAudit(this IAuditableExtension entity, IAuditableDto dto, bool isCreated = false, bool isUtc = false)
        {
            if (isCreated)
            {
                entity.CreatedBy = dto.LastModifiedBy;
                entity.CreatedOn = isUtc ? DateTime.UtcNow : DateTime.Now;
                entity.CreatedByName = dto.LastModifiedByName;
            }
            else
            {
                entity.UpdatedBy = dto.LastModifiedBy;
                entity.UpdatedOn = isUtc ? DateTime.UtcNow : DateTime.Now;
                entity.UpdatedByName = dto.LastModifiedByName;
            }
        }
        public static void SetAudit(this IAuditable entity, string userId,string userName, bool isCreated = false,bool isUtc=false)
        {
            var dto = new AuditableDto();
            dto.SetAudit(userId,userName);
            entity.SetAudit(dto, isCreated,isUtc);
        }

        public static async Task<ICollection<Audit>> GetAuditByEntityTypeAndEntityIdAsync(this IQueryable<Audit> query, AuditableEntity<long> entity)
        {
            var ret = query.Where(p => p.TableName == entity.GetType().Name && p.KeyValues == entity.Id.ToString());
            return await ret.ToListAsync<Audit>();
        }

        public static async Task<ICollection<Audit>> GetAuditByEntityTypeAndEntityIdAsync(this IQueryable<Audit> query, AuditableEntity<int> entity)
        {
            var ret = query.Where(p => p.TableName == entity.GetType().Name && p.KeyValues == entity.Id.ToString());
            return await ret.ToListAsync<Audit>();
        }

        public static async Task<ICollection<Audit>> GetAuditByEntityTypeAndEntityIdAsync(this IQueryable<Audit> query, AuditableEntity<string> entity)
        {
            var ret = query.Where(p => p.TableName == entity.GetType().Name && p.KeyValues == entity.Id);
            return await ret.ToListAsync<Audit>();
        }

        public static async Task<ICollection<Audit>> GetAuditByEntityTypeAndEntityIdAsync(this IQueryable<Audit> query, AuditableEntity<Guid> entity)
        {
            var ret = query.Where(p => p.TableName == entity.GetType().Name && p.KeyValues == entity.Id.ToString());
            return await ret.ToListAsync<Audit>();
        }

        public static void SetAudit(this IAuditableDto dto, string userId, string userName)
        {
            dto.LastModifiedBy = userId;
            dto.LastModifiedByName = userName;
        }

       /* public static void SetAudit(this IAuditableDto dto, ClaimsPrincipal userPrincipal)
        {
            UserProfile user = userPrincipal.GetUserAccount();
            dto.LastModifiedBy = user.UserId;
            dto.LastModifiedByName = user.UserName;
        }*/


    }
}
