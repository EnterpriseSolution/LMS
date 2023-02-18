using System;
using System.Collections.Generic;
using System.Text;

namespace Yokogawa.Data.Infrastructure.DTOs.Base
{
    public interface IAuditableDto
    {
        public string CreatedBy { get; set; }
        public string CreatedByName { get; set; }
        public DateTime CreatedOn { get; set; }
        string LastModifiedBy { set; get; }
        DateTime LastModifiedOn { set; get; }
        string LastModifiedByName { set; get; }
    }
}
