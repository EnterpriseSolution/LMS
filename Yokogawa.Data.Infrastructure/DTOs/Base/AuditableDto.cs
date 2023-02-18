using System;
using System.Collections.Generic;
using System.Text;

namespace Yokogawa.Data.Infrastructure.DTOs.Base
{
    public class AuditableDto: IAuditableDto
    {
        public string CreatedBy { get; set; }
        public string CreatedByName { get; set; }
        public DateTime CreatedOn { get; set; }
        public string LastModifiedBy { set; get; }
        public DateTime LastModifiedOn { set; get; }
        public string LastModifiedByName { set; get; }
    }
}
