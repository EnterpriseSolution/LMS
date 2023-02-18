using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.Data.Infrastructure.Entities.Base;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    public partial class DashboardSharedUser:AuditableEntity<Guid>,IChild
    {
        public Guid DashboardId { get; set; }
        public string UserId { get; set; }
        public Dashboard Dashboard { get; set; }
    }
}
