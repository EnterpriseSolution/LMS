using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.Data.Infrastructure.Extensions;

namespace Yokogawa.LMS.Platform.Data.Commands
{
    public static class ClientCommand
    {
        public static async Task<Client> ValidatePermissionAsync(this DbSet<Client> dbSet, Guid id, IUserProfile user)
        {
            Client entity = await dbSet.ExcludeDeletion().GetById(id).FirstOrDefaultAsync();
            bool isValid =user.RoleIds.Contains(PredefinedValues.AdminRoleId.ToString()) || entity.CreatedBy == user.UserId;
            if (!isValid)
                throw new UnauthorizedAccessException("action is not allowed");
            return entity;
        }

        public static async Task<Client> CreateOrUpdateAsync(this DbSet<Client> dbSet, IClientDto dto,IUserProfile user) {
            dto.SetAudit(user.UserId, user.UserName);
            Client client = await dbSet.ValidatePermissionAsync(dto.Id, user);

            bool isCreated = client == null;
            if (isCreated)
            {
                client = new Client();
                dbSet.Add(client);
                client.Secret = EncryptUtility.CreateSecret();
            }

            client.Name = dto.Name;
            client.AllowOrignal = dto.AllowOrignal; 
            client.EnableSSO = dto.EnableSSO;
            client.EnableRefreshToken = dto.EnableRefreshToken;
            client.Enable2FA = dto.Enable2FA;
            client.EnableSSO = dto.EnableSSO;
            client.TokenlifeTime = dto.TokenLifeTime;
            client.RefreshTokenlifeTime = dto.RefreshTokenLifeTime;
            client.ReturnUrl = dto.ReturnUrl;
            client.SetAudit(dto, isCreated, true);
            return client;

        }

        public static async Task<Client> DeleteAsync(this DbSet<Client> dbSet, IClientDto dto,IUserProfile user)
        {
            var client = await dbSet.ValidatePermissionAsync(dto.Id, user);
            if (client == null)
                return client;

           client.LogicDelete(user.UserId,user.UserName,true);
           
            return client;
        }
    }
}
