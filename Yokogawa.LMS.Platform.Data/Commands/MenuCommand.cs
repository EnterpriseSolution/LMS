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

namespace Yokogawa.LMS.Platform.Data.Commands
{
    public static class MenuCommand
    {
        public static void ToEntity(this IMenuDto dto, Menu menu = null, bool isCreate = false)
        {
            menu = menu ?? new Menu() { Id = dto.Id };
            menu.Name = dto.Name;
            menu.Icon = dto.Icon;
            menu.OrderId = dto.OrderId;
            menu.PageId = dto.PageId;
            menu.ParentId = dto.ParentId;
            menu.WebsiteId = dto.WebsiteId;
            menu.SetAudit(dto, isCreate, true);
        }

        public static async Task<Menu> ValidatePermissionAsync(this DbSet<Menu> dbSet, Guid id, IUserProfile user,bool isDelete=false)
        {
            var query = !isDelete ? dbSet.GetById(id) : dbSet.GetById(id).Include(o=>o.Permissions);
            Menu entity = await query.Include(o => o.Website).FirstOrDefaultAsync();

            if (entity == null)
                return entity;

            bool isValid = entity.Website.AdminRoleId.HasValue && user.RoleIds.Contains(entity.Website.AdminRoleId.Value.ToString()) || user.RoleIds.Contains(PredefinedValues.AdminRoleId.ToString());// || entity.CreatedBy == user.UserId;
            if (!isValid)
                throw new UnauthorizedAccessException("action is not allowed");
            return entity;
        }

        public static void ValidateDeletion(this Menu menu) {
            StringBuilder sb = new StringBuilder();
            var isSystemMenu = menu.WebsiteId == PredefinedValues.AllWebsiteId;
            if (isSystemMenu)
                sb.AppendLine("delete system menu is not allowed");

            if (sb.Length > 0)
                throw new ConflictException(sb.ToString());
        }
        public static async Task ValidateAsync(this DbSet<Menu> dbSet, IMenuDto dto)
        {
            StringBuilder sb = new StringBuilder();

            var isDuplicated = await dbSet.AsNoTracking().Where(o => o.Id != dto.Id && o.Name == dto.Name).CountAsync() > 0;
            if (isDuplicated)
                sb.AppendLine("Duplicate menu name");

            if (sb.Length > 0)
                throw new ConflictException(sb.ToString());

        }

        public static async Task<Menu> CreateOrUpdateAsync(this DbSet<Menu> dbSet, IMenuDto dto,IUserProfile user) {
            dto.SetAudit(user.UserId, user.UserName);
            dto.PageId = string.IsNullOrEmpty(dto.PageId) ? null : dto.PageId;
            var menu = await dbSet.ValidatePermissionAsync(dto.Id, user);
            await dbSet.ValidateAsync(dto);

            bool isCreate = menu == null;
            if (isCreate) {
                menu = new Menu();
                dbSet.Add(menu);
            }

            dto.ToEntity(menu,isCreate);
            return menu;
        }

        public static async Task<bool> DeleteAsync(this DbSet<Menu> dbSet, Guid id,IUserProfile user)
        {
            bool isDelete = false;
            var menu = await dbSet.ValidatePermissionAsync(id, user,true);
            isDelete = menu != null;

            if (isDelete) {
                menu.ValidateDeletion();
                menu.Permissions.Clear();
                dbSet.Remove(menu);
            }
            
            return isDelete;
        }
    }
}
