using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace Yokogawa.Security.OAuth.Configuration
{
    public class AzureAdOptions
    {
        public string Instance { get; set; }
        public string ClientId { get; set; }
        public string Tenant { get; set; }
        public string Authority => Instance + Tenant;
        public string ClientSecret { get; set; }
        public string GraphApiUrl { get; set; }
        public List<string> Scope { get;set;}
    }


}
