using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.Security.OAuth.Utils;

namespace Yokogawa.Security.OAuth.Identity
{
    public class RefreshTokenDto : IRefreshTokenDto
    {
        public string Id { get; set; }
        public string Refresh_TokenHash
        {
            get
            {
                return EncryptUtility.GetHash(Refresh_Token);
            }
        }
        public string Refresh_Token { get; set; }
        public string UserId { get; set; }
        public string ClientId { get; set; }
        public string ProtectedTicket { get; set; }
        public DateTime IssuedUtc { get; set; }
        public DateTime ExpiresUtc { get; set; }

        public string OldTokenId { get; set; }
    }
}
