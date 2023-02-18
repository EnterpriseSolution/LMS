using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    [Keyless]
    public class V_RoleWebsite
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public System.DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public string DefaultPageId { get; set; }
        public Guid WebsiteId { get; set; }
    }
}
