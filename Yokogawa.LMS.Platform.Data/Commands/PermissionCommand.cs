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
using Yokogawa.Data.Infrastructure.Extensions;

namespace Yokogawa.LMS.Platform.Data.Commands
{
    public static class PermissionCommand
    {
        public static async Task<List<Permission>> CreateAsync(this DbSet<Permission> dbSet, IRoleDto dto) {
            var newPermssions = new List<Permission>();
            var permissions = await dbSet.Include(o=>o.Menu).Where(o => o.RoleId == dto.Id && (o.Menu.WebsiteId == dto.WebsiteId || o.Menu.WebsiteId == PredefinedValues.AllWebsiteId) && o.Menu.SecurityLevel == 0).ToListAsync();
            var oldPermissionIds = permissions.Select(o => o.MenuId).ToList();
            dto.PermissionIds = dto.PermissionIds == null ? new List<Guid>() : dto.PermissionIds;
            var deletedItems = permissions.Where(o => !dto.PermissionIds.Contains(o.MenuId)).ToList();
            dbSet.RemoveRange(deletedItems);

            var newItems = dto.PermissionIds.Where(id => !oldPermissionIds.Contains(id)).ToList();
            foreach (var id in newItems)
            {
                var permission = new Permission()
                {
                    MenuId = id,
                    RoleId = dto.Id
                };

                permission.SetAudit(dto,true,true);
                newPermssions.Add(permission);
            }
            return newPermssions;
        }

        public static async Task CreateAsync(this DbSet<Permission> dbSet, IMenuDto dto)
        {
            var permissions = await dbSet.Where(o => o.MenuId == dto.Id).ToListAsync();
            var oldRoleIds = permissions.Select(o => o.RoleId).ToList();

            dto.RoleIds = dto.RoleIds == null ? new List<Guid>() : dto.RoleIds;
            var deletedItems = permissions.Where(o => !dto.RoleIds.Contains(o.RoleId)).ToList();
            var newRoleIds = dto.RoleIds.Where(id => !oldRoleIds.Contains(id)).ToList();

            dbSet.RemoveRange(deletedItems);
            
            foreach (var id in newRoleIds)
            {
                var permission = new Permission()
                {
                    MenuId = dto.Id,
                    RoleId = id
                };

                permission.SetAudit(dto,true,true);
                dbSet.Add(permission);
            }
        }
    }
}
