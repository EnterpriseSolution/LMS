using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.LMS.Exceptions;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.Data.Infrastructure.Extensions;

namespace Yokogawa.LMS.Platform.Data.Commands
{
    public static class PageCommand
    {
        public static void ToEntity(this IPageDto dto, Page page=null, bool isCreated=false)
        {
            page = page ?? new Page() { Id = dto.Id};
            page.Url = dto.Url;
            page.Description = dto.Description;
            page.WidgetId = dto.WidgetId;
            page.SetAudit(dto, isCreated, true);
        }

        public static async Task ValidateAsync(this DbSet<Page> dbSet, IPageDto dto) {
            StringBuilder sb = new StringBuilder();
            var isDuplicated = await dbSet.AsNoTracking().Where(o => o.Id != dto.Id && o.WidgetId == dto.WidgetId && (o.Url == dto.Url || o.Description.ToLower() == dto.Description.ToLower())).CountAsync() > 0;
            if (isDuplicated)
                sb.AppendLine("Duplicate page");

            if (sb.Length > 0)
                throw new ConflictException(sb.ToString());

        }

        public static void ValidateDeletion(this Page entity)
        {
            StringBuilder sb = new StringBuilder();
            var isSystemPage = entity.Widget == null;
            if (isSystemPage)
                sb.AppendLine("delete system page is not allowed");

            if (entity.Menus.Count() > 0)
                sb.AppendLine("page is used in menu, please delete menu first.");

            if (sb.Length > 0)
                throw new ConflictException(sb.ToString());



        }

        public static async Task<Page> CreateOrUpdateAsync(this DbSet<Page> dbSet, IPageDto dto,IUserProfile user) {
            dto.SetAudit(user.UserId, user.UserName);
            var page = await dbSet.ValidatePermissionAsync(dto.Id, user);
            await dbSet.ValidateAsync(dto);

            bool isCreated = page == null;
            if (isCreated) {
                page = new Page();
                dbSet.AddWithNewId<Page>(page);
            }

            dto.ToEntity(page,isCreated);
            return page;
        }

        public static async Task<Page> ValidatePermissionAsync(this DbSet<Page> dbSet, string id, IUserProfile user,bool isDelete=false)
        {
            var query = !isDelete ? dbSet.GetById(id) : dbSet.GetById(id).Include(o => o.Menus);
            Page entity = await query.Include(o => o.Widget).ThenInclude(p=>p.Website).FirstOrDefaultAsync();

            if (entity == null)
                return entity;

            var website = entity.Widget == null ? null : entity.Widget.Website;

            bool isValid = user.RoleIds.Contains(PredefinedValues.AdminRoleId.ToString()) || (website != null && user.RoleIds.Contains(website.AdminRoleId.ToString()));// || entity.CreatedBy == user.UserId;
            if (!isValid)
                throw new UnauthorizedAccessException("action is not allowed");
            return entity;
        }

        public static async Task<bool> DeleteAsync(this DbSet<Page> dbSet, string id,IUserProfile user)
        {
            bool isDelete = false;
            var page = await dbSet.ValidatePermissionAsync(id, user,true);
            isDelete = page != null;

            if (isDelete) {
                page.ValidateDeletion();
                dbSet.Remove(page);
            }
                
            return isDelete;
        }

    }
}
