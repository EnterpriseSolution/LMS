using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    [Keyless]
    public class V_UserPortal
    {
        public string UserId { get; set; }
        public Guid WebsiteId { get; set; }
        public string WebsiteName { get; set; }
        public string HomePageId { get; set; }
        public string Url { get; set; }
        public string Component { get; set; }
        public string DefaultLanguageId { get; set; }
        public string Route { get; set; }
    }
}
