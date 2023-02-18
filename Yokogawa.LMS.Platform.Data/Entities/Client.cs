using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;
using System.ComponentModel.DataAnnotations;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    public partial class Client:SoftDeleteAuditableEntity<Guid>
    {
        public Client() {
            this.RefreshTokens = new HashSet<RefreshToken>();
        }

        public string Secret { get; set; }

        public string Name { get; set; }

        public int ApplicationType { get; set; }

        public int RefreshTokenlifeTime { get; set; }

        public int TokenlifeTime { get; set; } = 15;

        public string AllowOrignal { get; set; }

        public bool Enable2FA { get; set; } = true;

        public bool EnableRefreshToken { get; set; } = true;


        public string SFAUrl { get; set; }
        
        public string ReturnUrl { get; set; }

        public bool EnableSSO { get; set; }
        
        public ICollection<RefreshToken> RefreshTokens { get; set; }
    }
}
