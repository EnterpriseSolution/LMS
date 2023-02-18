using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    public partial class Dashboard:AuditableEntity<Guid>
    {
        public Dashboard() {
            this.DashboardSharings = new HashSet<DashboardSharing>();
            this.DashboardViews = new HashSet<DashboardView>();
            this.DashboardSharedUsers = new HashSet<DashboardSharedUser>();
        }
        public string Name { get; set; }
        public string ViewModelName { get; set; }
        public int Layout { get; set; }
        public bool IsPublish { get; set; }
        public Guid WebsiteId { get; set; }
        public bool IsDefault { get; set; }
        public Website Website { get; set; }

        public ICollection<DashboardSharing> DashboardSharings { get; set; }
        public ICollection<DashboardSharedUser> DashboardSharedUsers { get; set; }
        public ICollection<DashboardView> DashboardViews { get; set; }
    }
}
