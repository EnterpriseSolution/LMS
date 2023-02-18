using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Yokogawa.Data.Infrastructure.Entities.Base;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    [Keyless]
    public partial class V_WebsiteMenu
    {
        public Guid MenuId { get; set; }
        public string MenuName { get; set; }
        public string ParentMenuName { get; set; }
        public string Icon { get; set; }
        public string PageId { get; set; }
        public Nullable<Guid> ParentId { get; set; }
        public Nullable<Guid> WidgetId { get; set; }
        public int OrderId { get; set; }
        public Guid WebsiteId { get; set; }
        public string WebsiteName { get; set; }
        public string HomePageId { get; set; }
        public Guid AdminRoleId { get; set; }
        public int IsSystemMenu { get; set; }
        public string CreatedBy { get; set; }
        public System.DateTime CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedOn { get; set; }
        public string PageDescription { get; set; }
        public int SecurityLevel { get; set; }
    }
}
