using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.Data.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Yokogawa.Data.Infrastructure.Entities.Base;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    public partial class DashboardView: AuditableEntity<Guid>,IChild
    {
        public Guid DashboardId { get; set; }
        public Guid ViewId { get; set; }
        public Dashboard Dashboard { get; set; }
        public View View { get; set; }
        public override void GetValuesForAudit(AuditEntry entry, DbContext dbContext)
        {
            var _context = dbContext as JoypadDBContext;
            var view = _context.Views.AsNoTracking().Where(o => o.Id == this.ViewId).FirstOrDefault();
            var result = new Dictionary<string, string>();
            if (view != null)
            {
                entry.NewValues.Add("View", view.Name);
            }

        }
    }

    
}
