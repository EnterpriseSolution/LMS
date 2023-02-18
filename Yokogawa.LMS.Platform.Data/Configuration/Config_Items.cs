using System;
using System.Collections.Generic;
using System.Text;

namespace Yokogawa.LMS.Platform.Data.Configuration
{
    public partial class Config_Items
    {
        public string Category { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public string Type { get; set; }
        public Nullable<int> Level { get; set; }
    }
}
