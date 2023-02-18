using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    [Keyless]
    public class V_UserPage
    {
        public string UserId { get; set; }
        public Guid MenuId { get; set; }
        public string MenusName { get; set; }
        public string Icon { get; set; }
        public Nullable<Guid> ParentId { get; set; }
        public string Url { get; set; }
        public string PageId { get; set; }
        public Nullable<int> Type { get; set; }
        public string Component { get; set; }
        public Guid WebsiteId { get; set; }
        public string WebsiteName { get; set; }
        public string HomePageId { get; set; }
        public int OrderId { get; set; }
        public Nullable<Guid> WidgetId { get; set; }
        public string WidgetName { get; set; }
    }
}
