using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.Data.Infrastructure.DTOs;

namespace Yokogawa.LMS.Business.Services.Interfaces
{
    public interface ITruckService
    {
        Task<PagedCollection<TruckDto>> GetTrucks(IFilter filter);
        Task<TruckDto> GetTruck(Guid id);
        Task<TruckDto> SaveTruck(TruckDto TruckDto, IUserProfile user);
        Task DeleteTruck(Guid id, IUserProfile user);
    }
}
