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
using Yokogawa.Data.Infrastructure;

namespace Yokogawa.LMS.Platform.Data.Commands
{
    public static class DashboardCommand
    {    
        public static void ToEntity(this IDashboardDto dto, Dashboard entity = null, bool isCreated = false)
        {
            entity = entity ?? new Dashboard() { Id = dto.Id };

            if (isCreated) 
                entity.ViewModelName = "DB" + entity.Id.ToString().Replace("-", "");
            
            entity.Name = dto.Name;
            entity.WebsiteId = dto.WebsiteId;
            entity.IsDefault = dto.IsDefault;
            //entity.IsPublish = dto.IsPublish;
            entity.Layout = dto.Layout;
            entity.SetAudit(dto, isCreated, true);

            entity.DashboardViews.Clear();
            foreach (var viewId in dto.ViewIds) {
                
                var view = new DashboardView()
                {
                    ViewId = viewId,
                };
                
                view.SetAudit(dto,true, true);
                entity.DashboardViews.Add(view);
            }

            var oldRoleIds = entity.DashboardSharings.Select(o => o.RoleId).ToList();
            var deletedRoles = entity.DashboardSharings.Where(o => !dto.RoleIds.Contains(o.RoleId)).ToList();
            foreach (var item in deletedRoles)
                entity.DashboardSharings.Remove(item);

            var newRoleIds = dto.RoleIds.Where(id => !oldRoleIds.Contains(id));
            
            foreach (var roleId in newRoleIds) {
                var role = new DashboardSharing()
                {
                    RoleId = roleId
                };
                role.SetAudit(dto, true, true);
                entity.DashboardSharings.Add(role);
            }

            var oldUserIds = entity.DashboardSharedUsers.Select(o => o.UserId).ToList();
            var deletedUsers = entity.DashboardSharedUsers.Where(o => !dto.UserIds.Contains(o.UserId)).ToList();
            foreach (var item in deletedUsers)
                entity.DashboardSharedUsers.Remove(item);

            var newUserIds = dto.UserIds.Where(id => !oldUserIds.Contains(id));
            foreach (var userId in newUserIds)
            {
                var user = new DashboardSharedUser()
                {
                    UserId = userId
                };
                user.SetAudit(dto, true, true);
                entity.DashboardSharedUsers.Add(user);
            }
        }

        public static async Task<Dashboard> ValidatePermissionAsync(this DbSet<Dashboard> dbSet, Guid id, IUserProfile user)
        {
            Dashboard entity = await dbSet.GetById(id).Include(o => o.Website).Include(o => o.DashboardSharings).Include(o => o.DashboardViews).Include(o=>o.DashboardSharedUsers).FirstOrDefaultAsync();

            if (entity == null)
                return entity;

            bool isValid = entity.Website.AdminRoleId.HasValue && user.RoleIds.Contains(entity.Website.AdminRoleId.Value.ToString()) || user.RoleIds.Contains(PredefinedValues.AdminRoleId.ToString()) || entity.CreatedBy == user.UserId;
            if (!isValid)
                throw new UnauthorizedAccessException("action is not allowed");

            return entity;
        }

        public static async Task<View> ValidatePermissionAsync(this DbSet<View> dbSet, Guid id, IUserProfile user,bool isDelete=false)
        {
            bool isValid = false;
            var query = !isDelete ? dbSet.GetById(id) : dbSet.GetById(id).Include(p => p.DashboardViews);
            View entity = await query.Include(p => p.Website).FirstOrDefaultAsync();

            if (entity == null)
                return entity;
            var isAdmin = user.RoleIds.Contains(PredefinedValues.AdminRoleId.ToString());

            isValid = isAdmin || user.RoleIds.Contains(entity.Website.AdminRoleId.ToString()) || entity.CreatedBy == user.UserId;

            if (!isValid)
                throw new UnauthorizedAccessException("action is not allowed");

            return entity;
        }

        public static async Task<Dashboard> CreateOrUpdateAsync(this DbSet<Dashboard> dbSet, IDashboardDto dto,IUserProfile user)
        {
            dto.SetAudit(user.UserId, user.UserName);
            var dashboard = await dbSet.ValidatePermissionAsync(dto.Id, user);
            bool isCreated = dashboard == null;
            if (isCreated)
            {
                dashboard = new Dashboard();
                dbSet.Add(dashboard);
            }
            dto.ToEntity(dashboard, isCreated);
            return dashboard;
        }

        public static async Task<bool> DeleteAsync(this DbSet<Dashboard> dbSet, Guid id,IUserProfile user)
        {
            bool isDelete = false;
            var dashboard = await dbSet.ValidatePermissionAsync(id, user);
            isDelete = dashboard != null;

            if (isDelete) {
                dbSet.Remove(dashboard);
            }
            

            return isDelete;
        }

        public static void ToEntity(this IViewDto dto, View entity = null, bool isCreated = false)
        {
            entity = entity ?? new View() { Id = dto.Id };
            entity.Name = dto.Name;
            entity.Description = dto.Description;

            if (dto.WidgetId.HasValue)
                entity.WidgetId = dto.WidgetId;

            entity.ViewModelType = dto.ViewModelType;
            entity.Model = string.IsNullOrEmpty(dto.Model) ? "" : dto.Model;
            entity.Action = string.IsNullOrEmpty(dto.Action)?"":dto.Action;
            entity.SetAudit(dto, isCreated, true);
        }

        public static async Task<bool> DeleteAsync(this DbSet<View> dbSet, Guid id, IUserProfile user)
        {
            bool isDelete = false;
            var view = await dbSet.ValidatePermissionAsync(id, user,true);
            isDelete = view != null;

            if (isDelete) {
                if (view.DashboardViews.Count() > 0)
                    throw new ConflictException("view is used in dashboard, cannot be deleted");

                dbSet.Remove(view);
            }
            
            
            return isDelete;
        }

        public static async Task<View> CreateOrUpdateAsync(this DbSet<View> dbSet, IViewDto dto,IUserProfile user)
        {
            dto.SetAudit(user.UserId, user.UserName);
            var view = await dbSet.ValidatePermissionAsync(dto.Id, user);
            bool isCreated = view == null;
            var isAdmin = user.RoleIds.Contains(PredefinedValues.AdminRoleId.ToString());
            if (isCreated)
            {
                view = new View();
                dbSet.Add(view);
                view.DefaultWebsiteId = dto.DefaultWebsiteId;
                view.IsPrivate = dto.IsPrivate;
                view.DefaultWebsiteId = dto.DefaultWebsiteId;
            }

            if (isAdmin && !isCreated)
                view.DefaultWebsiteId = dto.DefaultWebsiteId;

            dto.ToEntity(view, isCreated);
            return view;
        }

        public static async Task<Dashboard> PublishAsync(this DbSet<Dashboard> dbSet, Guid id, IUserProfile user) {
            var dashboard = await dbSet.ValidatePermissionAsync(id, user);
            if (dashboard != null) {
                dashboard.IsPublish = !dashboard.IsPublish;
                dashboard.SetAudit(user.UserId, user.UserName, false, true);
            }
            return dashboard;
        }
    }
}
