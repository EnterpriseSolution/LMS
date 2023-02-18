using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.Data.Infrastructure.Entities.Base;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    public class ModulePermission : AuditableEntity<Guid>, IChild
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int ResourceType { get; set; }
        public Guid RoleId { get; set; }
        public Guid? WidgetId { get; set; }
        public Guid WebsiteId { get; set; }
        public bool ReadPermission { get; set; }
        public bool WritePermission { get; set; }
        public Role Role { get; set; }
        public Widget Widget { get; set; }
        public Website Website { get; set; }

    }
}
