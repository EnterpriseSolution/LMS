using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.Data.Infrastructure.Entities.Base;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    public partial class DashboardSharing:AuditableEntity<Guid>,IChild
    {
        public Guid DashboardId { get; set; }
        public Guid RoleId { get; set; }

        public Dashboard Dashboard { get; set; }
        public Role Role { get; set; }
    }
}
