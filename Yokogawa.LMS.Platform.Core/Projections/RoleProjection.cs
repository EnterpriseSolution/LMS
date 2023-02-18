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
    public static class RoleProjection
    {
        public static WidgetSettingDto  ToWidgetSettingDto (this RoleWidgetSetting m) {
           return new WidgetSettingDto()
           {
               Id = m.Id,
               JSONParameter = m.JSONParameter,
               WidgetId = m.WidgetId,
               WidgetName = m.Widget!=null? m.Widget.Name:string.Empty
           };
        }

        public static ModulePermissionDto ToModulePermissionDto(this ModulePermission o)
        {
            return new ModulePermissionDto()
            {
                Id= o.Id,
                Name = o.Name,
                Description = o.Description,
                WidgetId = o.WidgetId,
                RoleId = o.RoleId,
                WebsiteId = o.WebsiteId,
                ReadPermission = o.ReadPermission,
                WritePermission = o.WritePermission,
                ResourceTypeId = o.ResourceType
            };
        }
        public static Expression<Func<Role, RoleDto>> RoleDetailDto {
            get {
                return (m)=>new RoleDto() {
                    Id = m.Id,
                    Name = m.Name,
                    Description = m.Description,
                    DefaultPageId = m.DefaultPageId,
                    WebsiteId = m.DefaultWebsiteId,
                    DefaultWebsiteId = m.DefaultWebsiteId,
                    IsSystemDefined = m.IsSystemDefined,
                    SFAProviderIds = m.SFASettings.Select(o=>o.ProviderId).ToList(),
                    PermissionIds = m.Permissions.Select(o=>o.MenuId).ToList(),
                    WidgetSettings = m.RoleWidgetSettings.Select(o=>o.ToWidgetSettingDto()).ToList(),
                    ModulePermissions = m.ModulePermissions.Select(o=>o.ToModulePermissionDto()).ToList()
                }.GetAudit<RoleDto>(m);
            }
        }
    }
}
