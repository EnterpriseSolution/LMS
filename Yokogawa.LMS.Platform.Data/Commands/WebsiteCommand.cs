using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Yokogawa.Data.Infrastructure.Extensions;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.LMS.Exceptions;
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.LMS.Platform.Data.Commands
{
    public static class WebsiteCommand
    {
        public static async Task<bool> VerifyWebsiteAdminAsync(this DbSet<Website> dbSet,Guid id,IEnumerable<string> roleIds) {
            return await dbSet.GetById(id).AsNoTracking().Where(o => roleIds.Contains(o.AdminRoleId.ToString())).CountAsync() > 0;

        }
        public static async Task ValidateAsync(this DbSet<Website> dbSet, IWebsiteDto dto, bool isDelete=false) {

            StringBuilder sb = new StringBuilder();

            bool isForbidden = await dbSet.GetById(dto.Id).AsNoTracking().Where(o => o.IsSystemDefined).CountAsync() > 0;

            if (isForbidden && isDelete)
                sb.AppendLine("Fobidden Delete");

            if (!isDelete) {
                bool isDuplicated = await dbSet.ExcludeDeletion().AsNoTracking().Where(o => (o.Name.ToLower() == dto.Name.ToLower() || (!string.IsNullOrEmpty(dto.Route)&&!string.IsNullOrEmpty(o.Route) && o.Route.ToLower() == dto.Route.ToLower()))&& o.Id != dto.Id).CountAsync() > 0;
                if (isDuplicated)
                    sb.AppendLine("Duplicated Website Name or Route");
            }
            
            if (sb.Length > 0)
                throw new ConflictException(sb.ToString());
                
        }
        public static async Task<Website> CreateOrUpdateAsync(this DbSet<Website> dbSet, IWebsiteDto dto,IUserProfile user) {
            dto.SetAudit(user.UserId, user.UserName);
            Website website = null;
            await dbSet.ValidateAsync(dto);

            if (dto.Id != Guid.Empty)
               website = await dbSet.GetById(dto.Id).FirstOrDefaultAsync();
            
            bool isCreated = website == null;
            if (isCreated) {
                website = new Website();
                dbSet.Add(website);
            }

            website.Name = dto.Name;
            website.HomePageId = dto.HomePageId;
            website.AdminRoleId = dto.AdminRoleId;
            website.AuditTrailAPI = dto.AuditTrailAPI;
            website.DefaultLanguageId = string.IsNullOrEmpty(dto.DefaultLanguageId)?"":dto.DefaultLanguageId;
            website.Route = dto.Route;
            website.SetAudit(dto,isCreated,true);
            return website;
        }

        public static async Task<Website> DeleteAsync(this DbSet<Website> dbSet, IWebsiteDto dto,IUserProfile user)
        {
            await dbSet.ValidateAsync(dto, true);
            var website = await dbSet.ExcludeDeletion().GetById(dto.Id).FirstOrDefaultAsync();
            if (website == null)
                return website;

            website.LogicDelete(user.UserId, user.UserName, true);
            return website;
        }
    }
}
