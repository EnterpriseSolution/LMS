using System;
using System.Collections.Generic;
using System.Text;

namespace Yokogawa.Data.Infrastructure.DTOs.Base
{
    public interface IDto<TID>
    {
        TID Id { get; set; }
    }
}
