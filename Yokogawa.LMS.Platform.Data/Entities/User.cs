using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;
using System.ComponentModel.DataAnnotations;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    public partial class User : SoftDeleteAuditableEntity<Guid>
    {
        public string UserId { get; set; }
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string Company { get; set; }
        public string Password { get; set; }
        public Guid DefaultWebsiteId { get; set; }
        public bool IsSystemDefined { get; set; } = false;
        public Website Website { get; set; }
    }
}
