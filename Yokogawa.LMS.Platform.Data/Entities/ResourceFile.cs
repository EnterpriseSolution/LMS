using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    public partial class ResourceFile:AuditableEntity<Guid>
    { 
        public string FileName { get; set; }
        public string FileUrl { get; set; }
        public string FilePath { get; set; }
        public Nullable<Guid> WidgetId { get; set; }
        public Widget Widget { get; set; }
        public Guid WebsiteId { get; set; }
        public Website Website { get; set; }
    }
}
