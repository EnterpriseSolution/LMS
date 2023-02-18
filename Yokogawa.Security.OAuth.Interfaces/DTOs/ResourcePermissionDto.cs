using System;
using System.Collections.Generic;
using System.Text;

namespace Yokogawa.Security.OAuth.Interfaces
{
    public class ResourcePermissionDto
    {
        public Guid ApplicationId { get; set; }
        public string ResourceName { get; set; }
        public bool AllowRead { get; set; }
        public bool AllowWrite { get; set; }
    }
}
