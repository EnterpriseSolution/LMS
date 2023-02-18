using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Platform.Core.Services.Interfaces;
using System.Threading.Tasks;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.LMS.Platform.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.LMS.Platform.Core.Projections;
using Yokogawa.LMS.Platform.Data.Commands;
using Yokogawa.LMS.Exceptions;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.LMS.Platform.Core.QueryObjects;

namespace Yokogawa.LMS.Platform.Core.Services
{
    public class PageService : BaseService<PageService>, IPageService
    {
        public PageService(JoypadDBContext dbContext, ILogger<PageService> logger) : base(dbContext, logger)
        { 
        }
        public async Task DeletePage(string id,IUserProfile user)
        {
            var pageDto = new PageDto() { Id = id };
            await _dbContext.Pages.DeleteAsync(id,user);
            await _dbContext.SaveChangesAsync();
            return;
        }

        public async Task<PageDto> GetPage(string id,Guid websiteId, IUserProfile user)
        {
            PageDto page = string.IsNullOrEmpty(id) ? new PageDto() { CreatedBy = user.UserId, WidgetNamespace=PredefinedValues.DefaultViewModelName} : null;
            var permissionLevel = await GetPermissionLevel(user, websiteId);
            page =page?? await _dbContext.Pages.GetById(id).GetByPermission(permissionLevel,websiteId,user.UserId).FirstOrDefaultAsync();
            
            if (page == null)
                throw new NotFoundCustomException("Record is not found");

            page.Widgets = await _dbContext.Widgets.AsNoTracking().Where(o => o.DefaultWebsiteId == websiteId || o.DefaultWebsiteId == PredefinedValues.AllWebsiteId)
                .Select<Widget, WidgetDto>(o => new WidgetDto()
                {
                    Id = o.Id,
                    Name = o.Name,
                    ServiceUrl = o.ServiceUrl
                }).ToListAsync();
            return page;
        }

        public async Task<IEnumerable<PageDto>> GetPageList(IUserProfile user, Guid websiteId)
        {
            var permissionLevel = await GetPermissionLevel(user, websiteId);
            return await _dbContext.Pages.GetByPermission(permissionLevel,websiteId,user.UserId).ToListAsync();
        }

        public async Task<IEnumerable<PageDto>> GetPages(Guid websiteId)
        {
            return await _dbContext.Pages.Where(o => o.Widget == null || (o.Widget != null && (o.Widget.DefaultWebsiteId == websiteId || o.Widget.DefaultWebsiteId == PredefinedValues.AllWebsiteId))).Select<Page, PageDto>(PageProjection.PageDto).ToListAsync();
        }

        public async Task<PageDto> SavePage(PageDto pageDto, IUserProfile user)
        {
            var page = await _dbContext.Pages.CreateOrUpdateAsync(pageDto,user);
            await _dbContext.SaveChangesAsync();
            pageDto.Id = page.Id;
            return pageDto;
        }
    }
}
