using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.Data.Infrastructure.Entities.Base;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    public class UserRole:AuditableEntity<Guid>
    {
        public string UserId { get; set; }
        public Guid RoleId { get; set; }
        public Role Role { get; set; }
    }
}
