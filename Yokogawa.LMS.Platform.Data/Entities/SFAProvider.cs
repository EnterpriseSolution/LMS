using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.Data.Infrastructure.Entities.Base;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    public partial class SFAProvider: Entity<int>
    {
        public SFAProvider() {
            this.SFASettings = new HashSet<SFASetting>();
        }

        public string Name { get; set; }
        public string Url { get; set; }
        public bool IsSystemProvider { get; set; }
        public ICollection<SFASetting> SFASettings { get; set; }
    }
}
