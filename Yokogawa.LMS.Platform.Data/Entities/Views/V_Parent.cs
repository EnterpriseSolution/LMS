using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    [Keyless]
    public partial class V_Parent
    {
        public Guid Id { get; set; }
        public Guid WebsiteId { get; set; }
        public string Name { get; set; }
    }
}
