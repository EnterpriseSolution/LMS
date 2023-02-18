using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    [Keyless]
    public class V_ActiveUser
    {
        public string UserId { get; set; }
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string Company { get; set; }
        public Guid DefaultWebsiteId { get; set; }
        public string CreatedBy { get; set; }
    }
}
