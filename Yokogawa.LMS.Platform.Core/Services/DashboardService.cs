using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Yokogawa.LMS.Platform.Data;
using Microsoft.Extensions.Logging;
using Yokogawa.LMS.Platform.Core.Services.Interfaces;
using System.Threading.Tasks;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.LMS.Platform.Core.DTOs;
using Microsoft.EntityFrameworkCore;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Platform.Data.Commands;
using Yokogawa.LMS.Platform.Data.QueryObjects;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.LMS.Platform.Core.Projections;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.LMS.Exceptions;
using Yokogawa.LMS.Platform.Core.QueryObjects;

namespace Yokogawa.LMS.Platform.Core.Services
{
    public class DashboardService : BaseService<DashboardService>, IDashboardService
    {
        public DashboardService(JoypadDBContext dbContext, ILogger<DashboardService> logger) : base(dbContext, logger)
        {}

        public async Task<IEnumerable<DashboardDto>> GetDashboards(Guid websiteId, IUserProfile user)
        {
            var permissionLevel = await GetPermissionLevel(user, websiteId);
            if (permissionLevel==EnumPermissionLevel.SystemAdmin || permissionLevel == EnumPermissionLevel.WebsiteAdmin)
                return await _dbContext.Dashboards.Where(o => o.WebsiteId == websiteId).Select<Dashboard,DashboardDto>(DashboardProjection.DashboardListDto).ToListAsync();
            else
                return await _dbContext.Dashboards.Where(o => o.WebsiteId == websiteId && o.CreatedBy == user.UserId).Select<Dashboard, DashboardDto>(DashboardProjection.DashboardListDto).ToListAsync();
        }

        public async Task<DashboardDto> GetDashboard(Guid id,Guid websiteId,IUserProfile user)
        {
            DashboardDto dashboard = id == Guid.Empty ? new DashboardDto() { WebsiteId = websiteId, CreatedBy= user.UserId} : null;

            dashboard = dashboard?? await _dbContext.Dashboards.Where(o=>o.Id == id)
                .Include(o => o.DashboardSharings)
                .Include(o => o.DashboardViews)
                .Include(o=>o.DashboardSharedUsers)
                .Select<Dashboard,DashboardDto>(DashboardProjection.DashboardDto).FirstOrDefaultAsync();

            if (dashboard == null)
                throw new NotFoundCustomException("Record is not found");

            var permissionLevel = await GetPermissionLevel(user, dashboard.WebsiteId);

            if (permissionLevel == EnumPermissionLevel.User && dashboard.CreatedBy != user.UserId)
                throw new NotFoundCustomException("Record is not found");

            if (dashboard != null) {
                dashboard.ViewSource = await _dbContext.Views.Where(o => o.DefaultWebsiteId == dashboard.WebsiteId && (o.IsPrivate == false || o.CreatedBy == user.UserId)).Select(view => new ViewDto()
                {
                    Id = view.Id,
                    Name = view.Name,
                    Description = view.Description
                }).ToListAsync<ViewDto>();

                dashboard.Users = await _dbContext.V_ActiveUsers.Where(o => dashboard.UserIds.Contains(o.UserId)).Select<V_ActiveUser, UserDto>(UserProjection.ActiveUserDto).ToListAsync();
            }
             
                   

            return dashboard;

        }

        public async Task<DashboardDto> SaveDashboard(DashboardDto dashboardDto,IUserProfile user)
        {
            var dashboard =await _dbContext.Dashboards.CreateOrUpdateAsync(dashboardDto,user);
            await _dbContext.SaveChangesAsync();
            dashboardDto.Id = dashboard.Id;
            return dashboardDto;
        }

        public async Task DeleteDashboard(Guid id,IUserProfile user)
        {

            bool isDelete = await _dbContext.Dashboards.DeleteAsync(id,user);
            if (isDelete)
                await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<ViewDto>> GetViews(Guid websiteId,IUserProfile user)
        {
            var permissionLevel = await GetPermissionLevel(user, websiteId);
            List<ViewDto> views = await _dbContext.Views.Include(o=>o.Widget).GetByPermission(permissionLevel, websiteId, user.UserId).ToListAsync();
            return views;
        }

        public async Task<ViewDto> GetView(Guid id, Guid websiteId, IUserProfile user)
        {
            ViewDto view = id == Guid.Empty ? new ViewDto() { DefaultWebsiteId = websiteId,Name=""} : null;
            view = view?? await _dbContext.Views.GetById(id).Include(o=>o.Widget).AsNoTracking().Select<View, ViewDto>(DashboardProjection.ViewDto).FirstOrDefaultAsync();
            if (view == null)
                throw new NotFoundCustomException("Record is not found");

            var permissionLevel = await GetPermissionLevel(user, view.DefaultWebsiteId);
            view.IsPrivate = permissionLevel == EnumPermissionLevel.User;
            view.WidgetSource = await _dbContext.Widgets.GetByPermission(permissionLevel, view.DefaultWebsiteId, user.UserId).ToListAsync();
            return view;
        }

        public async Task<ViewDto> SaveView(ViewDto viewDto, IUserProfile user)
        {
            var permissionLevel = await GetPermissionLevel(user, viewDto.DefaultWebsiteId);
            if (permissionLevel == EnumPermissionLevel.User)
                viewDto.IsPrivate = true;
            var view = await _dbContext.Views.CreateOrUpdateAsync(viewDto,user);
            await _dbContext.SaveChangesAsync();
            viewDto.Id = view.Id;
            return viewDto;
        }

        public async Task DeleteView(Guid id,IUserProfile user)
        {
            bool isDelete = await _dbContext.Views.DeleteAsync(id,user);
            if (isDelete)
                await _dbContext.SaveChangesAsync();
        }

        public async Task<bool> PublicDashboard(Guid id, IUserProfile user) {
            var dashboard = await _dbContext.Dashboards.PublishAsync(id, user);
            await _dbContext.SaveChangesAsync();
            return dashboard.IsPublish;
        }
    }
}
