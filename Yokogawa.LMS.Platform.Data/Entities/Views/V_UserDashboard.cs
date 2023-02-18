using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    [Keyless]
    public class V_UserDashboard
    {
        public string UserId { get; set; }
        public Guid DashboardId { get; set; }
        public string DashboardName { get; set; }
        public string ViewModelName { get; set; }
        public int Layout { get; set; }
        public Guid ViewId { get; set; }
        public string Model { get; set; }
        public string Action { get; set; }
        public string ViewModelType { get; set; }
        public Nullable<Guid> WidgetId { get; set; }
        public string Name { get; set; }
        public string InstanceName { get; set; }
        public string Component { get; set; }
        public string TemplateFileFolder { get; set; }
        public string ServiceUrl { get; set; }
        public Guid WebsiteId { get; set; }
        public string ViewName { get; set; }
    }
}
