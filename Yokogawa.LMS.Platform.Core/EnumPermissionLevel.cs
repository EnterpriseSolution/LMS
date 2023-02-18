using System;
using System.Collections.Generic;
using System.Text;

namespace Yokogawa.LMS.Platform.Core
{
    public class PermssionLevel { 
        public EnumPermissionLevel UserLevel { get; set; }

    }
    public enum EnumPermissionLevel
    {
        User =0,
        WebsiteAdmin,
        SystemAdmin
    }
}
