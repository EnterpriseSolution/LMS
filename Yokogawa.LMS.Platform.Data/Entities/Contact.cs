using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities.Base;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    public partial class Contact:Entity<Guid>
    {
        public string UserId { get; set; }
        public string ContactName { get; set; }
        public string ContactEmail { get; set; }
        public string Mobile { get; set; }
        public string Extension { get; set; }
        public string ContactId { get; set; }
        public string Company { get; set; }
    }
}
