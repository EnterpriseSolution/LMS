using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.LMS.Platform.Core.Services.Interfaces
{
    public interface IMenuService
    {
        Task<IEnumerable<MenuDto>> GetMenuList(Guid websiteId, IUserProfile user);
        Task<IEnumerable<MenuDto>> GetParents(Guid websiteId);
        Task<MenuDto> GetMenu(Guid id, Guid websiteId, IUserProfile user);
        Task<MenuDto> SaveMenu(MenuDto menu, IUserProfile user);
        Task DeleteMenu(Guid id, IUserProfile user);
        Task<IEnumerable<MenuDto>> GetMenus(Guid websiteId);
    }
}
