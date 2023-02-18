using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.LMS.Platform.Core.DTOs
{
    public class UserRoleDto: AuditableDto, IUserRoleDto
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public Guid RoleId { get; set; }
    }
}
