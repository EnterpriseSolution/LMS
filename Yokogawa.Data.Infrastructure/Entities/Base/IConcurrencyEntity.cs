using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace Yokogawa.Data.Infrastructure.Entities.Base
{
    public interface IConcurrencyEntity
    {
        [Timestamp]
        byte[] RowVersion { get; set; }
    }
}
