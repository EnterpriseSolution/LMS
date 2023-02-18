using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.Security.OAuth.Identity
{
    public class UserProfile:IUserProfile
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Domain { get; set; }

        public string Email { get; set; }

        public string Company { get; set; }
        public List<string> RoleIds { get; set; }
        public string Roles {
            get {
                var roles = string.Empty;
                if (RoleIds == null)
                    return roles;

                foreach (var id in RoleIds)
                {
                     roles+= id + ";";
                }
                
                return roles.TrimEnd(';');
            }
        }
        public bool Require2FA { get; set; }
        public List<IMFASettingDto> SFASettings { get; set; } = new List<IMFASettingDto>();
        public List<ResourcePermissionDto> APIPermissions { get; set; } = new List<ResourcePermissionDto>();
    }
}
