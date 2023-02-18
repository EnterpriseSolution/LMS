using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Yokogawa.Data.Infrastructure.Entities;
using System.ComponentModel.DataAnnotations;
using Yokogawa.Data.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    public partial class Page:AuditableEntity<string>
    {
        public Page() {
            Menus = new HashSet<Menu>();
            Websites = new HashSet<Website>();
        }

        [Required]
        public string Url { get; set; }
        [MaxLength(100)]
        public string Description { get; set; }
        public int Type { get; set; } = 0;
        public Nullable<Guid> WidgetId { get; set; }

        public  ICollection<Menu> Menus { get; set; }
        public Widget Widget { get; set; }

        public ICollection<Website> Websites { get; set; }

        public override void GetValuesForAudit(AuditEntry entry, DbContext dbContext)
        {
            if (this.WidgetId == null && this.WidgetId == Guid.Empty)
                return;

            var _context = dbContext as JoypadDBContext;
            var widget = _context.Widgets.AsNoTracking().Where(o => o.Id == this.WidgetId).FirstOrDefault();
            var result = new Dictionary<string, string>();
            if (widget != null)
            {
                entry.NewValues.Add("Widget", widget.Name);
                entry.NewValues.Add("WebsiteId", widget.DefaultWebsiteId);
            }

        }
    }
}
