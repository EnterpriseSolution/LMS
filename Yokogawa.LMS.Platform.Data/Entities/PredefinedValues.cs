using System;
using System.Collections.Generic;
using System.Text;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    public static class PredefinedValues
    {
        public const string AdminUserId = "sysadmin";
        public const string DefaultHomePageId = "home";
        public const string DefaultViewModelName = "ViewModel";
        public const string DefaultWebsiteId = "11111111-1111-1111-1111-111111111111";

        public static Guid AllWebsiteId {
            get { 
                return Guid.Empty;
            }
        }

        public static Guid AdminRoleId
        {
            get
            {
                return Guid.Parse("11111111-1111-1111-1111-111111111111");
            }
        }

    }
}
