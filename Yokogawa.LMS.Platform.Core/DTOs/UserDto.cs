using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.LMS.Platform.Core.DTOs
{
    public class UserDto : AuditableDto, IUserDto
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string Company { get; set; }
        public string Password { get; set; }
        public string NewPassword { get; set; }
        public string Domain { get; set; }
        // public string Secret { get; set; }
        public bool Require2FA { get; set; }
        //public string Owner { get; set; }
        public bool IsSystemDefined { get; set; }
        public List<string> RoleIds { get; set; } = new List<string>();
        public Guid WebsiteId { get; set; }
        public Guid DefaultWebsiteId { get; set; }
        public List<Website> Websites { get; set; } = new List<Website>();
        public List<MFASettingDto> SFASettings { get; set; } = new List<MFASettingDto>();
        
    }
}
