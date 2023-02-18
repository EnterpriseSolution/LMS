using System;
using System.Collections.Generic;
using System.Text;

namespace Yokogawa.Data.Infrastructure.Entities.Base
{
    public interface ISoftDeleteEntity
    {
         bool IsDeleted { get; set; }

    }
}
