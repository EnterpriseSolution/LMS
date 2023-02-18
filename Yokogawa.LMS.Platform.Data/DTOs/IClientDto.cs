using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.LMS.Platform.Data.DTOs
{
    public interface IClientDto:IDto<Guid>,IClientBaseDto,IAuditableDto
    {
    }
}
