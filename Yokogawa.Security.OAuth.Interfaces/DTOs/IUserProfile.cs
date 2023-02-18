using System;
using System.Collections.Generic;
using System.Text;

namespace Yokogawa.Security.OAuth.Interfaces
{
    public interface IUserProfile
    {
        string UserId { get; set; }
        string UserName { get; set; }
        string Domain { get; set; }
        string Company { get; set; }
        string Email { get; set; }
        List<string> RoleIds { get; set; }
        string Roles { get;}
        bool Require2FA { get; set; }
        List<IMFASettingDto> SFASettings { get; set; }
        List<ResourcePermissionDto> APIPermissions { get; set; }
    }
}
