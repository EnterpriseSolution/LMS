using System;
using System.Collections.Generic;
using System.Text;
using System.Linq.Expressions;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.Data.Infrastructure.Extensions;
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.LMS.Platform.Core.Projections
{
    public static class ClientProjection
    {
        public static Expression<Func<Client, ClientDto>> ClientDto {
            get {
                return (m) => new ClientDto()
                {
                    Id = m.Id,
                    Name = m.Name,
                    RefreshTokenLifeTime = m.RefreshTokenlifeTime,
                    TokenLifeTime = m.TokenlifeTime,
                    Enable2FA = m.Enable2FA,
                    EnableSSO = m.EnableSSO,
                    EnableRefreshToken = m.EnableRefreshToken,
                    AllowOrignal = m.AllowOrignal,
                }.GetAudit<ClientDto>(m);
            }
        }

        public static Expression<Func<Client, ClientDto>> ClientDtoWithHashSecret
        {
            get
            {
                return (m) => new ClientDto()
                {
                    Id = m.Id,
                    Name = m.Name,
                    RefreshTokenLifeTime = m.RefreshTokenlifeTime,
                    TokenLifeTime = m.TokenlifeTime,
                    Enable2FA = m.Enable2FA,
                    EnableSSO = m.EnableSSO,
                    EnableRefreshToken = m.EnableRefreshToken,
                    AllowOrignal = m.AllowOrignal,
                    HashSecret = EncryptUtility.GetHash(m.Secret)
                }.GetAudit<ClientDto>(m);
            }
        }

        public static Expression<Func<Client, ClientDto>> ClientDtoWithSecret
        {
            get
            {
                return (m) => new ClientDto()
                {
                    Id = m.Id,
                    Name = m.Name,
                    RefreshTokenLifeTime = m.RefreshTokenlifeTime,
                    TokenLifeTime = m.TokenlifeTime,
                    Enable2FA = m.Enable2FA,
                    EnableSSO = m.EnableSSO,
                    EnableRefreshToken = m.EnableRefreshToken,
                    AllowOrignal = m.AllowOrignal,
                    Secret = m.Secret,
                    HashSecret = EncryptUtility.GetHash(m.Secret)
                }.GetAudit<ClientDto>(m);
            }
        }
    }
}
