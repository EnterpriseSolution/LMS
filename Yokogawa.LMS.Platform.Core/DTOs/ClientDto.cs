using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.LMS.Platform.Core.DTOs
{
    public class ClientDto : AuditableDto, IClientDto
    {
        public string Name { get; set; }
        public Guid Id { get; set; }
        public String ClientId {
            get {
                return Id.ToString();
            }
        }
        public string Secret { get; set; }
        public string HashSecret {
            get;set;
        }
        public int TokenLifeTime { get; set; } = 20;
        public int RefreshTokenLifeTime { get; set; } = 120;
        public string AllowOrignal { get; set; }
        public bool Enable2FA { get; set; } = true;
        public bool EnableSSO { get; set; }
        public bool EnableRefreshToken { get; set; } = true;
        public string ReturnUrl { get; set; }
        public IEnumerable<ClientDto> Clients { get; set; }
    }
}
