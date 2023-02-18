using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Security.Cryptography;
using Yokogawa.Security.OAuth.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Yokogawa.Security.OAuth.Authentication;
using Yokogawa.Security.OAuth.Identity;

namespace Yokogawa.Security.OAuth.Utils
{
    public static class RefreshTokenUtility
    {
        public static IRefreshTokenDto CreateRefreshToken(string userId,string clientId,string protectedTicket,DateTime issuedUtc,DateTime expiresUtc) {
            RefreshTokenDto token = new RefreshTokenDto()
            {
                Refresh_Token = Guid.NewGuid().ToString("n"),
                ClientId = clientId,
                UserId = userId,
                IssuedUtc = issuedUtc,
                ExpiresUtc = expiresUtc,
                ProtectedTicket = protectedTicket
            };

            token.Id = token.Refresh_TokenHash;
            return token;
        }
    }
}
