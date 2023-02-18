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
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Data.Infrastructure.Extensions;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.LMS.Exceptions;

namespace Yokogawa.LMS.Platform.Core.Services
{
    public class WebsiteService : BaseService<WebsiteService>, IWebsiteService
    {
        public WebsiteService(JoypadDBContext dbContext, ILogger<WebsiteService> logger) : base(dbContext, logger)
        { 
        }

        public async Task DeleteWebsite(Guid id,IUserProfile user)
        {
            var websiteDto = new WebsiteDto() { Id = id };
            var website = await _dbContext.Websites.DeleteAsync(websiteDto,user);
            if (website == null)
                return;
           
            await _dbContext.SaveChangesAsync();
        }

        public async Task<WebsiteDto> GetWebsite(Guid id,IUserProfile user)
        {            
            WebsiteDto website = null;
            if (!IsSystemAdmin(user))
                throw new UnauthorizedAccessException("Unauthorized Access");

            if (id == Guid.Empty)
                website =new WebsiteDto();
            else
                website = await _dbContext.Websites.ExcludeDeletion().GetById(id).Where(o => o.Id != PredefinedValues.AllWebsiteId).Select<Website, WebsiteDto>(m => new WebsiteDto()
                {
                    Id = m.Id,
                    Name = m.Name,
                    HomePageId = (m.HomePage == null ? "0" : m.HomePageId),
                    HomePage = (m.HomePage == null ? "" : m.HomePage.Description),
                    AdminRoleId = m.AdminRoleId,
                    AuditTrailAPI = m.AuditTrailAPI,
                    DefaultLanguageId = m.DefaultLanguageId,
                    Route = m.Route,
                    IsSystemDefined = m.IsSystemDefined
                }.GetAudit<WebsiteDto>(m)).FirstOrDefaultAsync();

            if (website == null)
                throw new NotFoundCustomException("website not found");

            website.Roles = await _dbContext.Roles.Where(o => o.DefaultWebsiteId == id || o.DefaultWebsiteId == PredefinedValues.AllWebsiteId)
                .Select<Role,RoleDto>(o=>new RoleDto() { 
                    Id = o.Id,
                    Name = o.Name
                }).ToListAsync();

            website.Pages = await _dbContext.Pages
                .Where(o => o.Widget != null && (o.Widget.DefaultWebsiteId == id || o.Widget.DefaultWebsiteId == PredefinedValues.AllWebsiteId) || o.Id == PredefinedValues.DefaultHomePageId).
                Select<Page, PageDto>(o => new PageDto()
                {
                    Id = o.Id,
                    Description = o.Description
                }).ToListAsync();
            return website;
        }

        public async Task<IEnumerable<WebsiteDto>> GetWebsites()
        {
            return await _dbContext.Websites.ExcludeDeletion().Where(o=>o.Id != PredefinedValues.AllWebsiteId).Select<Website, WebsiteDto>(m => new WebsiteDto()
            {
                Id = m.Id,
                Name = m.Name,
                HomePageId = (m.HomePage == null ? "0" : m.HomePageId),
                HomePage = (m.HomePage == null ? "" : m.HomePage.Description),
                DefaultLanguageId = m.DefaultLanguageId,
                IsSystemDefined = m.IsSystemDefined
            }.GetAudit<WebsiteDto>(m)).ToListAsync();
        }

        public async Task<WebsiteDto> SaveWebsite(WebsiteDto websiteDto, IUserProfile user)
        {
            var website = await _dbContext.Websites.CreateOrUpdateAsync(websiteDto,user);
            await _dbContext.SaveChangesAsync();
            websiteDto.Id = website.Id;
            return websiteDto;
        }
    }
}
