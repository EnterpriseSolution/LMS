using System;
using System.Collections.Generic;
using System.Text;

namespace Yokogawa.Data.Infrastructure.Entities.Base
{
    public interface IAuditableExtension:IAuditable
    {
        string CreatedByName { set; get; }
        string UpdatedByName { set; get; }
    }
}
