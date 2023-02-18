using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.Data.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    public partial class UserOTPSetting:AuditableEntity<Guid>
    {
        public string UserId { get; set; }
        public string Secret { get; set; }
        public string PinCode { get; set; }
        public int ProviderId { get; set; }

        public override void GetValuesForAudit(AuditEntry entry, DbContext dbContext)
        {
            var _context = dbContext as JoypadDBContext;
            var user = _context.V_ActiveUsers.AsNoTracking().Where(o => o.UserId == UserId).FirstOrDefault();
            var result = new Dictionary<string, string>();
            if (user != null)
                entry.NewValues.Add("WebsiteId", user.DefaultWebsiteId);

        }
    }
}
