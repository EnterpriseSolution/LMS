using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.Data.Infrastructure.Entities.Base;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    public partial class ViewRole:AuditableEntity<Guid>,IChild
    {
        public Guid RoleId { get; set; }
        public Guid ViewId { get; set; }

        public Role Role { get; set; }
        public View View { get; set; }
    }
}
