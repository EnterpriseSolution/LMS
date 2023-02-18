using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    public partial class Widget:AuditableEntity<Guid>
    {
        public Widget() {
            this.Pages = new HashSet<Page>();
            this.RoleWidgetSettings = new HashSet<RoleWidgetSetting>();
            this.ResourceFiles = new HashSet<ResourceFile>();
            this.Views = new HashSet<View>();
            this.ReferencedWidgets = new HashSet<Widget>();
        }
        public string Name { get; set; }
        public string InstanceName { get; set; }
        public string Description { get; set; }
        public string SourceFilePath { get; set; }
        public string ServiceUrl { get; set; }
        public string TemplateFileFolder { get; set; }
        public Guid? WidgetTemplateId { get; set; }
        public Guid DefaultWebsiteId { get; set; }
        public Website Website { get; set; }
        public Widget WidgetTemplate { get; set; }
        public ICollection<Page> Pages { get; set; }
        public ICollection<View> Views { get; set; }
        public ICollection<RoleWidgetSetting> RoleWidgetSettings { get; set; }
        public ICollection<ResourceFile> ResourceFiles { get; set; }
        public ICollection<Widget> ReferencedWidgets { get; set; }
    }
}
