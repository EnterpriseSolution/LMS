using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    public partial class Menu : AuditableEntity<Guid>
    {
        public Menu() {
            Permissions = new HashSet<Permission>();
            Children = new HashSet<Menu>();
        }
        public string Name { get; set; }
        public string Icon { get; set; }
        public string PageId { get; set; }
        public Nullable<Guid> ParentId { get; set; }
        public int OrderId { get; set; }
        public Guid WebsiteId { get; set; }
        public int SecurityLevel { get; set; } = 0;
        public Page Page { get; set; }
        public Website Website { get; set; }

        public Menu Parent { get; set; }
        
        public ICollection<Permission> Permissions { get; set; }
        public ICollection<Menu> Children { get; set; }
    }
}
