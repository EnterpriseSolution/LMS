using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.LMS.Platform.Core.Services.Interfaces
{
    public interface IClientService
    {
        Task<IEnumerable<ClientDto>> GetClientList(IUserProfile user,bool isIncludeSercet=false);
        Task<ClientDto> GetClient(Guid id,IUserProfile user);
        Task<ClientDto> SaveClient(ClientDto clientDto, IUserProfile user);
        Task DeleteClient(Guid id, IUserProfile user);

        Task<IEnumerable<ClientDto>> GetClients(IUserProfile user);
    }
}
