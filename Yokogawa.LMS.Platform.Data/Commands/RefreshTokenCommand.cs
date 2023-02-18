using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Yokogawa.LMS.Platform.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Platform.Data.QueryObjects;

namespace Yokogawa.LMS.Platform.Data.Commands
{
    public static class RefreshTokenCommand
    {
        public static RefreshToken Create(this DbSet<RefreshToken> refreshTokenDbSet, IRefreshTokenDto refreshTokenDto)
        {
            Guid clientId = Guid.Parse(refreshTokenDto.ClientId);

            RefreshToken token = new RefreshToken()
            {
                Id = refreshTokenDto.Id,
                ClientId = clientId,
                UserId = refreshTokenDto.UserId
            };

            refreshTokenDbSet.Add(token);

            token.ProtectedTicket = refreshTokenDto.ProtectedTicket;
            token.ExpiresUtc = refreshTokenDto.ExpiresUtc;
            token.IssuedUtc = refreshTokenDto.IssuedUtc;
            return token;
           
        }
    }
}
