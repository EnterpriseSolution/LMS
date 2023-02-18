using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.Data.Infrastructure.Entities.Base;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    public partial class SFASetting:AuditableEntity<Guid>,IChild
    {
        public int ProviderId { get; set; }
        public Guid RoleId { get; set; }
        public Role Role { get; set; }
        public SFAProvider SFAProvider { get; set; }
    }
}
