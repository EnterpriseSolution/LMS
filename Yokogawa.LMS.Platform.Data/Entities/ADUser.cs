using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;
using System.ComponentModel.DataAnnotations;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    public partial class ADUser: SoftDeleteAuditableEntity<Guid>
    {
        public string UserId { get; set; }
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string Company { get; set; }
        public string WindowsPincode { get; set; }
        public Guid DefaultWebsiteId { get; set; }
        public Website Website { get; set; }
    }
}
