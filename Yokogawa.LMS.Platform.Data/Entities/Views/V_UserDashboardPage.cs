using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    [Keyless]
    public class V_UserDashboardPage
    {
        public string UserId { get; set; }
        public string Name { get; set; }
        public string Icon { get; set; }
        public Nullable<Guid> ParentId { get; set; }
        public string Url { get; set; }
        public Guid PageId { get; set; }
        public int PageType { get; set; }
        public string Component { get; set; }
        public Guid WebsiteId { get; set; }
        public string WebSiteName { get; set; }
        public string HomePageId { get; set; }
        public int OrderId { get; set; }
    }
}
