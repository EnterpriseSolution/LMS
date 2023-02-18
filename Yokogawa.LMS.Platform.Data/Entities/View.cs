using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    public partial class View:AuditableEntity<Guid>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Model { get; set; }
        public string Action { get; set; }
        public string ViewModelType { get; set; }
        public bool IsPrivate { get; set; } = true;
        public Nullable<Guid> WidgetId { get; set; }
        public Guid DefaultWebsiteId { get; set; }
        public Website Website { get; set; }
        public Widget Widget { get; set; }
        public ICollection<DashboardView> DashboardViews { get; set; }
        public ICollection<ViewRole> ViewRoles { get; set; }
    }
}
