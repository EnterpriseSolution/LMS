using System;
using System.Collections.Generic;
using System.Text;

namespace Yokogawa.Security.OAuth.Interfaces
{
    public interface IRefreshTokenDto
    {
        string Id { get; set; }
        string Refresh_Token { get; set; }
        string Refresh_TokenHash { get; }
        string UserId { get; set; }
        string ClientId { get; set; }
        string ProtectedTicket { get; set; }
        System.DateTime IssuedUtc { get; set; }
        System.DateTime ExpiresUtc { get; set; }
        string OldTokenId { get; set; }
    }
}
