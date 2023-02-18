using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;
using System.ComponentModel.DataAnnotations;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    public partial class Website: SoftDeleteAuditableEntity<Guid>
    {
        public Website() { 
            Dashboards = new HashSet<Dashboard>();
            Menus = new HashSet<Menu>();
            Roles = new HashSet<Role>();
        }

        [Required]
        [MaxLength(80)]
        public string Name { get; set; }
        public string HomePageId { get; set; }
        public Nullable<Guid> AdminRoleId { get; set; }
        public string DefaultLanguageId { get; set; }
        public ICollection<Dashboard> Dashboards { get; set; }
        public string AuditTrailAPI { get; set; }
        public string Route { get; set; }
        public ICollection<Menu> Menus { get; set; }
        public ICollection<Role> Roles { get; set; }
        public ICollection<User> Users { get; set; }
        public ICollection<ADUser> ADUsers { get; set; }
        public ICollection<Widget> Widgets { get; set; }
        public ICollection<ResourceFile> ResourceFiles { get; set; }
        public ICollection<View> Views { get; set; }
        public Page HomePage { get; set; }
        public bool IsSystemDefined { get; set; } = false;
    }
}
