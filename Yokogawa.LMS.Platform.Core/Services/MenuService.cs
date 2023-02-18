using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.LMS.Platform.Core.Services.Interfaces;
using System.Threading.Tasks;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.LMS.Platform.Data;
using Yokogawa.LMS.Platform.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Platform.Core.Projections;
using Yokogawa.LMS.Platform.Data.Commands;
using Yokogawa.LMS.Exceptions;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.LMS.Platform.Core.QueryObjects;

namespace Yokogawa.LMS.Platform.Core.Services
{
    public class MenuService : BaseService<MenuService>,IMenuService
    {
        public MenuService(JoypadDBContext dbContext, ILogger<MenuService> logger) : base(dbContext, logger)
        { 
        }

        public async Task DeleteMenu(Guid id,IUserProfile user)
        {
            await _dbContext.Menus.DeleteAsync(id,user);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<MenuDto> GetMenu(Guid id,Guid websiteId, IUserProfile user)
        {
            MenuDto menu = id == Guid.Empty ? new MenuDto() { CreatedBy = user.UserId,WebsiteId = websiteId,IsChecked = true } : null;
            menu = menu?? await _dbContext.Menus.GetById(id).Include(o=>o.Permissions).Select<Menu,MenuDto>(MenuProjection.MenuDto).FirstOrDefaultAsync();

            if (menu == null)
                throw new NotFoundCustomException("Record is not found");

            var permissionLevel = await GetPermissionLevel(user, menu.WebsiteId);
            
            if (permissionLevel == EnumPermissionLevel.User)// && menu.CreatedBy != user.UserId)
                throw new NotFoundCustomException("Record is not found");

            if (menu.WebsiteId == PredefinedValues.AllWebsiteId)
                menu.Pages = await _dbContext.Pages.GetById(menu.PageId).AsNoTracking().Select<Page, PageDto>(PageProjection.PageDto).ToListAsync();
            else
                menu.Pages = await _dbContext.Pages.Include(o=>o.Widget).Where(o=>o.WidgetId.HasValue && (o.Widget.DefaultWebsiteId == menu.WebsiteId|| o.Widget.DefaultWebsiteId == PredefinedValues.AllWebsiteId)).Select<Page, PageDto>(PageProjection.PageDto).ToListAsync();

            return menu;
          
        }

        public async Task<IEnumerable<MenuDto>> GetMenuList(Guid websiteId, IUserProfile user)
        {
            var permissionLevel = await GetPermissionLevel(user, websiteId);
            if (permissionLevel == EnumPermissionLevel.SystemAdmin)
                return await _dbContext.V_WebsiteMenus.Where(o => o.WebsiteId == websiteId).Select<V_WebsiteMenu, MenuDto>(MenuProjection.MenuViewDto).OrderBy(o => o.Name).ToListAsync();
            else if (permissionLevel == EnumPermissionLevel.WebsiteAdmin)
                return await _dbContext.V_WebsiteMenus.Where(o => o.WebsiteId == websiteId && o.IsSystemMenu == 0).Select<V_WebsiteMenu, MenuDto>(MenuProjection.MenuViewDto).OrderBy(o => o.Name).ToListAsync();
            else
                return new List<MenuDto>();
                 // else
                 //   return await _dbContext.V_WebsiteMenus.Where(o => o.WebsiteId == websiteId && o.IsSystemMenu == 0 && o.CreatedBy == user.UserId).Select<V_WebsiteMenu, MenuDto>(MenuProjection.MenuViewDto).OrderBy(o => o.Name).ToListAsync();

        }

        public async Task<IEnumerable<MenuDto>> GetParents(Guid websiteId)
        {
            List<MenuDto> parents = await (from parent in _dbContext.V_Parents
                                         where parent.WebsiteId == websiteId
                                         select new MenuDto()
                                         {
                                             Id = parent.Id,
                                             Name = parent.Name
                                         }).OrderBy(o => o.Name).ToListAsync<MenuDto>();
            //parents.Add(new MenuDto() { Id = Guid.Empty, Name = "Select Option" });
            return parents;
        }

        public async Task<IEnumerable<MenuDto>> GetMenus(Guid websiteId)
        {
            return await _dbContext.V_WebsiteMenus.Where(o => o.WebsiteId == websiteId)
                .Select<V_WebsiteMenu, MenuDto>(MenuProjection.MenuViewDto).OrderBy(o => o.Name).ToListAsync();
        }

        public async Task<MenuDto> SaveMenu(MenuDto menuDto,IUserProfile user)
        {
            var menu = await _dbContext.Menus.CreateOrUpdateAsync(menuDto,user);
            await _dbContext.Permissions.CreateAsync(menuDto);
            await _dbContext.SaveChangesAsync();
            menuDto.Id = menu.Id;
            return menuDto;
        }
    }
}
