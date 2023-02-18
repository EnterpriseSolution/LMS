using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.LMS.Platform.Data.DTOs
{
    public interface IUserRoleDto:IDto<Guid>,IAuditableDto
    {
        string UserId { get; set; }
        Guid RoleId { get; set; }
    }
}
