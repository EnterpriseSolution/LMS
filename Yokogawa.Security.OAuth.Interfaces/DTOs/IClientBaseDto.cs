using System;
using System.Collections.Generic;
using System.Text;

namespace Yokogawa.Security.OAuth.Interfaces
{
    public interface IClientBaseDto
    {
        string ClientId { get;  }
        string Name { get; set; }
        string Secret { get; set; }

        int TokenLifeTime { get; set; } 
        int RefreshTokenLifeTime { get; set; }
        string AllowOrignal { get; set; }
        bool Enable2FA { get; set; }
        bool EnableSSO { get; set; }
        bool EnableRefreshToken { get; set; }
        string ReturnUrl { get; set; }
    }
}
