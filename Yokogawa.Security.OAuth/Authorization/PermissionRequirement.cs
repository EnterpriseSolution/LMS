using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace Yokogawa.Security.OAuth.Authorization
{
    public class PermissionRequirement:IAuthorizationRequirement
    {
        public PermissionRequirement(Guid applicationId,bool defaultFullPermission=false,bool enableMFA=true)
        {
            ApplicationId = applicationId;
            EnableMFA = enableMFA;
            DefaultFullPermission = defaultFullPermission;
        }

        public Guid ApplicationId { get; }
        public bool EnableMFA { get; }
        public bool DefaultFullPermission { get; }
    }
}
