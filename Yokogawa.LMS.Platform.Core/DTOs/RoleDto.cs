using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.Data.Infrastructure.Entities;

namespace Yokogawa.LMS.Platform.Core.DTOs
{
    public class RoleDto : AuditableDto, IRoleDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string DefaultPageId { get; set; }
        public Guid WebsiteId { get; set; }
        public Guid DefaultWebsiteId { get; set; }
        public bool IsSystemDefined { get; set; }
        public List<SFAProvider> SFAproviders { get; set; } 
        public List<int> SFAProviderIds { get; set; } = new List<int>();
        public List<Guid> PermissionIds { get; set; } = new List<Guid>();
        public List<WidgetSettingDto> WidgetSettings { get; set; }
        public string RoleId { 
            get {
                return Id.ToString();
            } 
        }
        public List<UserDto> Users { get; set; } = new List<UserDto>();
        public List<MenuDto> Permissions { get; set; }
        public List<ModulePermissionDto> ModulePermissions { get; set; } = new List<ModulePermissionDto>();
        public void SetAudit(IUserProfile user) {
            this.SetAudit(user.UserId, user.UserName);
            foreach (var item in WidgetSettings) {
                item.WebsiteId = this.WebsiteId;
                item.SetAudit(user.UserId, user.UserName);
            }
            foreach (var item in ModulePermissions)
            {
                item.WebsiteId = this.WebsiteId;
                item.SetAudit(user.UserId, user.UserName);
            }

        }
        
    }
}
