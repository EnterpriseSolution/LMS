using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;
using System.ComponentModel.DataAnnotations;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    public partial class Role:AuditableEntity<Guid>
    {
        public Role() {
            this.DashboardSharings = new HashSet<DashboardSharing>();
            this.Permissions = new HashSet<Permission>();
            this.RoleWidgetSettings = new HashSet<RoleWidgetSetting>();
            this.SFASettings = new HashSet<SFASetting>();
            this.UserRoles = new HashSet<UserRole>();
            this.ViewRoles = new HashSet<ViewRole>();
            this.ModulePermissions = new HashSet<ModulePermission>();
            //this.Websites = new HashSet<Website>();
        }

        
        public string Name { get; set; }
        public string Description { get; set; }
        public string DefaultPageId { get; set; }        
        public string Email { get; set; }
        public Guid DefaultWebsiteId { get; set; }
        public bool IsSystemDefined { get; set; } = false;

        public Website Website { get; set; }
        public ICollection<UserRole> UserRoles { get; set; }
       // public ICollection<Website> Websites { get; set; }
        public ICollection<ViewRole> ViewRoles { get; set; }
        public ICollection<SFASetting> SFASettings { get; set; }
        public ICollection<RoleWidgetSetting> RoleWidgetSettings { get; set; }

        public ICollection<ModulePermission> ModulePermissions { get; set; }
        public ICollection<DashboardSharing> DashboardSharings { get; set; }
        public ICollection<Permission> Permissions { get; set; }
    }
}
