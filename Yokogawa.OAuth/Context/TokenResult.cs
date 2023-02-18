using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Yokogawa.OAuth.Context
{
    public class TokenResult
    {
        public string access_token { get; set; }
        public string expires { get; set; }
    }
}
