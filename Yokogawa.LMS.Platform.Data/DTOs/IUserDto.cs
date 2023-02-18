using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.LMS.Platform.Data.DTOs
{
    public interface IUserDto: IDto<Guid>, IAuditableDto
    {
        //public Guid Id { get; set; }
        string UserId { get; set; }
        string DisplayName { get; set; }
        string Email { get; set; }
        string Company { get; set; }
        string Password { get; set; }
        //string Secret { get; set; }
        Guid DefaultWebsiteId { get; set; }
        Guid WebsiteId { get; set; }

    }
}
