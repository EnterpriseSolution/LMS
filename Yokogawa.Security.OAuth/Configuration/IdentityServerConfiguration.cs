using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using System.Linq;
using Microsoft.IdentityModel.Tokens;

namespace Yokogawa.Security.OAuth.Configuration
{
    public class IdentityServerConfiguration
    {
        public string Issuer { set; get; }
        public bool ValidateIssuer { get; set; }
        public AudiencesConfigurationCollection AudiencesConfigurations { set; get; }

       public List<string> Audiences {
            get {
                return AudiencesConfigurations.Select(o => o.ClientId).ToList();
            }
        }
        public List<SecurityKey> keys {
            get {
                
                return AudiencesConfigurations.Select(o => o.Securitykey).ToList<SecurityKey>();
            } 
        }
    }

    public class AudiencesConfigurationCollection : List<AudiencesConfiguration>
    {
    }

    public class AudiencesConfiguration {
        public string ClientId { get; set; }
        public string Secret { get; set; }
        public SecurityKey Securitykey
        {
            get {
                if (!string.IsNullOrEmpty(Secret))
                    return new SymmetricSecurityKey(Base64UrlTextEncoder.Decode(Secret));
                else
                    return null;
            }
        }
    }
}
