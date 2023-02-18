using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Platform.Core.Services.Interfaces;
using System.Threading.Tasks;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.LMS.Platform.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.LMS.Platform.Core.Projections;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.LMS.Platform.Data.Commands;
using Yokogawa.Data.Infrastructure.Entities;

namespace Yokogawa.LMS.Platform.Core.Services
{
    public class ClientService :BaseService<Client>, IClientService
    {
        public ClientService(JoypadDBContext dbContext, ILogger<Client> logger) : base(dbContext, logger)
        {
        }

        public async Task<ClientDto> GetClient(Guid id, IUserProfile user)
        {
            var isAdmin = IsSystemAdmin(user);
            ClientDto client = null;

            if (id == Guid.Empty)
                client = new ClientDto();
            else
               client = await _dbContext.Clients.ExcludeDeletion().Where(o => o.Id == id && (o.CreatedBy == user.UserId || isAdmin)).Select<Client, ClientDto>(ClientProjection.ClientDtoWithHashSecret).FirstOrDefaultAsync();

            if (client != null) {
                client.Clients = await GetClientList(user,true);
            }
                
            return client;
        }

        public async Task<IEnumerable<ClientDto>> GetClientList(IUserProfile user, bool isIncludeSecret=false)
        {
            if (IsSystemAdmin(user))
            {
                if (isIncludeSecret)
                    return await _dbContext.Clients.ExcludeDeletion().Select<Client, ClientDto>(ClientProjection.ClientDtoWithHashSecret).ToListAsync();
                else
                    return await _dbContext.Clients.ExcludeDeletion().Select<Client, ClientDto>(ClientProjection.ClientDto).ToListAsync();
            }
            else {
                if (isIncludeSecret)
                    return await _dbContext.Clients.ExcludeDeletion().Where(o => o.CreatedBy == user.UserId).Select<Client, ClientDto>(ClientProjection.ClientDtoWithHashSecret).ToListAsync();
                else
                    return await _dbContext.Clients.ExcludeDeletion().Where(o => o.CreatedBy == user.UserId).Select<Client, ClientDto>(ClientProjection.ClientDto).ToListAsync();
            }
                

        }

        public async Task<ClientDto> SaveClient(ClientDto clientDto, IUserProfile user)
        {
            var client = await _dbContext.Clients.CreateOrUpdateAsync(clientDto,user);
            await _dbContext.SaveChangesAsync();
            return await _dbContext.Clients.AsNoTracking().Where(o => o.Id == client.Id).Select<Client, ClientDto>(ClientProjection.ClientDtoWithHashSecret).FirstOrDefaultAsync();
        }

        public async Task DeleteClient(Guid id,IUserProfile user)
        {
            var clientDto = new ClientDto() {Id = id};
      
            var client = await _dbContext.Clients.DeleteAsync(clientDto, user);
            if (client == null)
                return;

            await _dbContext.SaveChangesAsync();
            return;
        }

        public async Task<IEnumerable<ClientDto>> GetClients(IUserProfile user) {
            if (IsSystemAdmin(user))
                return await _dbContext.Clients.ExcludeDeletion().Select<Client, ClientDto>(ClientProjection.ClientDtoWithSecret).ToListAsync();
            else
                return await _dbContext.Clients.ExcludeDeletion().Where(o => o.CreatedBy == user.UserId).Select<Client, ClientDto>(ClientProjection.ClientDtoWithSecret).ToListAsync();
        }
    }
}
