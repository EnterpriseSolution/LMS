using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Linq.Expressions;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.Data.Infrastructure.Extensions;

namespace Yokogawa.LMS.Platform.Core.Projections
{
    public static class MenuProjection
    {
        public static Expression<Func<Menu, MenuDto>> MenuDto
        {
            get
            {
                return (menu) => new MenuDto()
                {
                    Id = menu.Id,
                    Name = menu.Name,
                    Icon = menu.Icon,
                    PageId = (menu.PageId == null ? "0" : menu.PageId),
                    PageDescription = (menu.Page == null ? "" : menu.Page.Description),
                    ParentId = menu.ParentId,
                    ParentName = menu.Parent!=null?menu.Parent.Name:"",
                    OrderId = menu.OrderId,
                    WebsiteId = menu.WebsiteId,
                    IsChecked = menu.WebsiteId != PredefinedValues.AllWebsiteId,
                    IsUserLevel = menu.SecurityLevel==0,
                    RoleIds = menu.SecurityLevel==0? menu.Permissions.Select(o=>o.RoleId).ToList():new List<Guid>()
                }.GetAudit<MenuDto>(menu);
            }
        }

        public static Expression<Func<V_WebsiteMenu, MenuDto>> MenuViewDto
        {
            get {
                return (menu) => new MenuDto()
                {
                    Id = menu.MenuId,
                    Name = menu.MenuName,
                    Icon = menu.Icon,
                    PageId = (menu.PageId == null ? "0" : menu.PageId),
                    PageDescription = menu.PageDescription,
                    ParentId = menu.ParentId,
                    ParentName = menu.ParentMenuName,
                    OrderId = menu.OrderId,
                    WebsiteId = menu.WebsiteId,
                    WidgetId = menu.WidgetId,
                    IsChecked = menu.IsSystemMenu == 0,
                    IsUserLevel = menu.SecurityLevel == 0,
                    LastModifiedBy = menu.UpdatedOn.HasValue ? menu.UpdatedBy : menu.CreatedBy,
                    LastModifiedByName = menu.UpdatedOn.HasValue ? menu.UpdatedBy : menu.CreatedBy,
                    LastModifiedOn = menu.UpdatedOn.HasValue ? menu.UpdatedOn.Value : menu.CreatedOn
                };
            }

        }
    }
}
