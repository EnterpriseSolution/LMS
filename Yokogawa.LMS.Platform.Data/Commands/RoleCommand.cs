using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
    public static class RoleCommand
    {
        public static void ValidateDeletion(this Role role)
        {
            StringBuilder sb = new StringBuilder();
            bool isForbidden = role != null && role.IsSystemDefined;

            if (isForbidden)
                sb.AppendLine("Fobidden Delete");

            if (sb.Length > 0)
                throw new ConflictException(sb.ToString());
        }

        public static async Task<Role> ValidatePermissionAsync(this DbSet<Role> dbSet,Guid id, IUserProfile user) {
            Role entity = await dbSet.GetById(id).Include(o => o.Website).Include(o=>o.Permissions).Include(o=>o.SFASettings).Include(o=>o.RoleWidgetSettings).Include(o=>o.ModulePermissions).FirstOrDefaultAsync();
            
            if (entity == null)
                return entity;

            bool isValid = entity.Website.AdminRoleId.HasValue && user.RoleIds.Contains(entity.Website.AdminRoleId.Value.ToString()) || user.RoleIds.Contains(PredefinedValues.AdminRoleId.ToString());// || (entity.CreatedBy == user.UserId);
            if (!isValid)
                throw new UnauthorizedAccessException("action is not allowed");

            return entity;
        }

        public static async Task ValidateAsync(this DbSet<Role> dbSet, IRoleDto dto) {
            StringBuilder sb = new StringBuilder();

            bool isDuplicated = await dbSet.AsNoTracking().Where(o => dto.Name.ToLower() == o.Name  && o.Id != dto.Id).CountAsync() > 0;
                
            if (isDuplicated)
                sb.AppendLine("Duplicated Role Name");

            if (sb.Length > 0)
                throw new ConflictException(sb.ToString());
        }

        public static async Task<Role> CreateOrUpdateAsync(this DbSet<Role> dbSet, IRoleDto dto,IUserProfile user) {
            dto.SetAudit(user);
            var role = await dbSet.ValidatePermissionAsync(dto.Id, user);
            bool isCreate = role == null;
            var isAdmin = user.RoleIds.Contains(PredefinedValues.AdminRoleId.ToString());

            if (isCreate)
            {
                role = new Role();
                role.DefaultWebsiteId = dto.DefaultWebsiteId;
                dbSet.AddWithNewGuid<Role>(role);
            }

            await dbSet.ValidateAsync(dto);

            role.Name = dto.Name;
            role.Description = dto.Description;
            role.DefaultPageId = dto.DefaultPageId;

            if (!role.IsSystemDefined && isAdmin)
               role.DefaultWebsiteId = dto.DefaultWebsiteId;
            
            role.SetAudit(dto, isCreate, true);

            var deletedSFASettings = role.SFASettings.Where(o => !dto.SFAProviderIds.Contains(o.ProviderId)).ToList();
            
            foreach (int id in dto.SFAProviderIds)
            {
                var item = role.SFASettings.Where(o => o.ProviderId == id).FirstOrDefault();
                if (item == null) {
                    var sfa = new SFASetting() { ProviderId = id, RoleId = role.Id };
                    role.SFASettings.Add(sfa);
                    sfa.SetAudit(dto, true, true);
                }   
            }

            foreach (var item in deletedSFASettings)
                role.SFASettings.Remove(item);

            return role;

        }

        public static void CreateOrUpdate(this Role role, IEnumerable<IModulePermissionDto> modulePermissionDtos) {
            if (modulePermissionDtos == null)
                return;
            modulePermissionDtos = modulePermissionDtos.Where(o => o.ReadPermission || o.WritePermission).ToList();
            var validItems = modulePermissionDtos.Where(o => o.ReadPermission || o.WritePermission).Select(o => o.Name + ',' + o.ResourceTypeId.ToString()).ToList();
            var deleteItems = role.ModulePermissions.Where(o => !validItems.Contains(o.Name + ',' + o.ResourceType)).ToList();

            foreach (var item in deleteItems)
                role.ModulePermissions.Remove(item);

            foreach (var item in modulePermissionDtos) {
                var permission = role.ModulePermissions.Where(o => o.Name == item.Name && o.ResourceType == item.ResourceTypeId).FirstOrDefault();
                bool isCreate = permission == null;
                if (isCreate)
                {
                    permission = new ModulePermission();
                    permission.WidgetId = item.WidgetId;
                    permission.Name = item.Name;
                    permission.ResourceType = item.ResourceTypeId;
                    role.ModulePermissions.Add(permission);
                }

                permission.WebsiteId = item.WebsiteId;
                permission.Description = item.Description;
                permission.ReadPermission = item.ReadPermission;
                permission.WritePermission = item.WritePermission;
                permission.SetAudit(item, isCreate, true);
            }
        }
        public static void CreateOrUpdate(this Role role, IEnumerable<IWidgetSettingDto> widgetSettingDtos) {
            if (widgetSettingDtos == null)
                return;
            var existingSettings = role.RoleWidgetSettings.Select(o => o.Id).ToList();
            var validSettings = widgetSettingDtos.Where(o => o.JSONParameter != null && o.JSONParameter.Length > 0);
            var validSettingIds = validSettings.Select(o => o.Id).ToList();
            var newSettings = validSettings.Where(o => !existingSettings.Contains(o.Id)).ToList();
            var deleteSettings = role.RoleWidgetSettings.Where(o => !validSettingIds.Contains(o.Id)).ToList();

            foreach (var item in deleteSettings)
                role.RoleWidgetSettings.Remove(item);

            foreach (IWidgetSettingDto item in newSettings)
            {
                var setting = new RoleWidgetSetting()
                {
                    JSONParameter = item.JSONParameter,
                    WidgetId = item.WidgetId,
                    WebsiteId = item.WebsiteId
                };
                role.RoleWidgetSettings.Add(setting);
                setting.SetAudit(item, true, true);
            }
        }
        public static async Task<bool> DeleteAsync(this DbSet<Role> dbSet, Guid id,IUserProfile user) {
            bool isDeleted = false;
            var role = await dbSet.ValidatePermissionAsync(id, user);
            isDeleted = role != null;

            if (!isDeleted)
                return isDeleted;

            role.ValidateDeletion();
            role.RoleWidgetSettings.Clear();
            role.Permissions.Clear();
            role.SFASettings.Clear();
            role.DashboardSharings.Clear();
            role.ViewRoles.Clear();
            dbSet.Remove(role);
            return isDeleted;

        }

        
    }
}
