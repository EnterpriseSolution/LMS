using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    [Keyless]
    public class V_UserWidget
    {
        public string UserId { get; set; }
        public Nullable<Guid> WidgetId { get; set; }
        public string Name { get; set; }
        public string InstanceName { get; set; }
        public string ServiceUrl { get; set; }
        public string TemplateFileFolder { get; set; }
        public Guid WebsiteId { get; set; }
        public string Component { get; set; }
    }
}
