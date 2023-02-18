using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.Data.Infrastructure.Entities.Base
{
    public interface IAuditable
    {
        string CreatedBy { set; get; }
        //string CreatedByName { set; get; }
        DateTime CreatedOn { set; get; }

        string UpdatedBy { set; get; }
        //string UpdatedByName { set; get; }
        DateTime? UpdatedOn { set; get; }
        void GetValuesForAudit(AuditEntry entry, DbContext dbContext=null);
     
    }
}
