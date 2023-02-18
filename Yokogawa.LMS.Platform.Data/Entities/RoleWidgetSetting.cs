using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.Data.Infrastructure.Entities.Base;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    public partial class RoleWidgetSetting:AuditableEntity<Guid>,IChild
    {
        public Guid RoleId { get; set; }
        public Guid WidgetId { get; set; }
        public string JSONParameter { get; set; }
        public Guid WebsiteId { get; set; }
        public Role Role { get; set; }
        public Widget Widget { get; set; }
    }
}
