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
using Yokogawa.LMS.Platform.Core.Projections;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.LMS.Exceptions;
using Yokogawa.LMS.Platform.Data.Commands;
using Yokogawa.Data.Infrastructure.Extensions;

namespace Yokogawa.LMS.Platform.Core.Services
{
    public class WidgetService : BaseService<WidgetService>, IWidgetService
    {
        public WidgetService(JoypadDBContext dbContext, ILogger<WidgetService> logger) : base(dbContext, logger)
        { 
        }
        public async Task DeleteResourcefile(string filePath, IUserProfile user)
        {
            var file= await _dbContext.ResourceFiles.ValidatePermissionAsync(filePath, user);

            if (file == null)
                return;

            _dbContext.ResourceFiles.Remove(file);
            await _dbContext.SaveChangesAsync();

        }

        public async Task DeleteWidget(Guid id, IUserProfile user)
        {
            var widget = await _dbContext.Widgets.ValidatePermissionAsync(id, user);
            if (widget == null)
                return;
            
            await _dbContext.Widgets.ValidateDeleteAsync(id);

            _dbContext.Widgets.Remove(widget);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<WidgetDto> GetWidgetByName(string name, Guid websiteId, IUserProfile user) {
            var permissionLevel = await GetPermissionLevel(user, websiteId);

            if (permissionLevel == EnumPermissionLevel.User)
                throw new UnauthorizedAccessException("No Permission");

            var widget= await _dbContext.Widgets.Where(o=>o.Name == name&&!o.WidgetTemplateId.HasValue).AsNoTracking().Select<Widget, WidgetDto>(WidgetProjection.WidgetDto).FirstOrDefaultAsync();

            return widget;
        }

        public async Task<WidgetDto> GetWidget(Guid id,Guid websiteId,IUserProfile user)
        {
            WidgetDto widget = id == Guid.Empty ? new WidgetDto() { CreatedBy = user.UserId, DefaultWebsiteId = websiteId,InstanceName = PredefinedValues.DefaultViewModelName} : null;
            widget =widget?? await _dbContext.Widgets.GetById(id).AsNoTracking().Select<Widget, WidgetDto>(WidgetProjection.WidgetDto).FirstOrDefaultAsync();
            
            if (widget == null)
                throw new NotFoundCustomException("Record is not found");

            var permissionLevel = await GetPermissionLevel(user, widget.DefaultWebsiteId);

            if (permissionLevel==EnumPermissionLevel.User)// && widget.CreatedBy != user.UserId)
                throw new UnauthorizedAccessException("No Permission");

            //if (permissionLevel == EnumPermissionLevel.WebsiteAdmin && widget.DefaultWebsiteId!=websiteId)
              //  throw new NotFoundCustomException("Record is not found");
            
            widget.WebsiteId = websiteId;
            
            if (widget.TemplateId.HasValue)
            {
                var template = await _dbContext.Widgets.GetById(widget.TemplateId.Value).AsNoTracking().Select<Widget, WidgetDto>(WidgetProjection.WidgetDto).FirstOrDefaultAsync();
                if (template != null)
                {
                    widget.TemplateWebsiteName = template.WebsiteName;
                    widget.Resources = template.Resources;
                }
            }
            else {
                widget.IsTemplate = await _dbContext.Widgets.Where(o => o.WidgetTemplateId.HasValue && o.WidgetTemplateId == widget.Id).CountAsync() > 0;
                widget.IsTemplate = widget.IsTemplate || widget.GlobalScope;
            }

            widget.EnableGlobalWidget = permissionLevel == EnumPermissionLevel.SystemAdmin && !widget.TemplateId.HasValue && !widget.IsTemplate;
            return widget;
        }

        public async Task<IEnumerable<WidgetDto>> GetWidgetList(IUserProfile user, Guid websiteId)
        {
            var permssionLevel = await GetPermissionLevel(user, websiteId);
            if (permssionLevel == EnumPermissionLevel.SystemAdmin)
                return await _dbContext.Widgets.AsNoTracking().Where(o => o.DefaultWebsiteId == websiteId || o.DefaultWebsiteId == PredefinedValues.AllWebsiteId)
                .Select<Widget, WidgetDto>(WidgetProjection.WidgetListDto).ToListAsync();
            else {
                if (permssionLevel == EnumPermissionLevel.WebsiteAdmin)
                    return await _dbContext.Widgets.AsNoTracking().Where(o => o.DefaultWebsiteId == websiteId).Select<Widget, WidgetDto>(WidgetProjection.WidgetListDto).ToListAsync();
                else
                    return new List<WidgetDto>();
            }
        }

        /*public async Task<IEnumerable<WidgetDto>> GetWidgets(Guid websiteId,IUserProfile user)
        {
            var permssionLevel = await GetPermissionLevel(user, websiteId);
            if (permssionLevel == EnumPermissionLevel.User)
                return new List<WidgetDto>();

            return await _dbContext.Widgets.AsNoTracking().Where(o => o.DefaultWebsiteId == websiteId || o.DefaultWebsiteId == PredefinedValues.AllWebsiteId)
                .Select<Widget, WidgetDto>(o => new WidgetDto() {
                    Id = o.Id,
                    Name = o.Name
                }).ToListAsync();
               
        }*/

        public async Task<IEnumerable<ResourceFileDto>> SaveResourcefiles(List<ResourceFileDto> files,IUserProfile user)
        {
            if (files.Count == 0)
                return files;

            Guid websiteId = files.Select(o => o.DefaultWebsiteId).FirstOrDefault();
            var permissionLevel = await GetPermissionLevel(user, websiteId);
            if (permissionLevel == EnumPermissionLevel.User)
                throw new NotFoundCustomException("Action is not allowed");

            await _dbContext.ResourceFiles.CreateOrUpdateAsync(files, user);
            await _dbContext.SaveChangesAsync();
            return files;
        }

        public async Task<WidgetDto> SaveWidget(WidgetDto widgetDto,IUserProfile user)
        {
            var permissionLevel = await GetPermissionLevel(user, widgetDto.WebsiteId);
            if (permissionLevel == EnumPermissionLevel.User)
                throw new UnauthorizedAccessException("Action is not allowed");

            var widget = await _dbContext.Widgets.CreateOrUpdateAsync(widgetDto,user);
            //widget.CreateOrUpdateResourceFiles(widgetDto.Resources);
            await _dbContext.SaveChangesAsync();
            widgetDto.Id = widget.Id;
            return widgetDto;

        }
    }
}
