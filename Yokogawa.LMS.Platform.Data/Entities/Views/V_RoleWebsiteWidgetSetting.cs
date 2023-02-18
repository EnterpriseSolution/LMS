using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    [Keyless]
    public class V_RoleWebsiteWidgetSetting
    {
        public Guid WebsiteId { get; set; }
        public Guid RoleId { get; set; }
        public Guid WidgetId { get; set; }
        public string JSONParameter { get; set; }
        public string WidgetName { get; set; }
    }
}
