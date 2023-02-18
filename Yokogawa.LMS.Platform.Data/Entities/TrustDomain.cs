using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    public partial class TrustDomain:AuditableEntity<int>
    {
        public string Name { get; set; }
        public string Domain { get; set; }
        public string DomainUser { get; set; }
        public string Password { get; set; }
        public Guid DefaultWebsiteId { get; set; }
        public Guid? DefaultRoleId { get; set; }
        public Guid? TenantId { get; set; }
        public Guid? AppId { get; set; }

    }
}
