using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.Data.Infrastructure.DTOs;

namespace Yokogawa.LMS.Business.Services.Interfaces
{
    public interface ITankService
    {
        Task<PagedCollection<TankDto>> GetTanks(IFilter filter);
        Task<TankDto> GetTank(Guid id);
        Task<TankDto> SaveTank(TankDto jetty, IUserProfile user);
        Task DeleteTank(Guid id, IUserProfile user);
        bool CheckTank(string tankNo);
    }
}
