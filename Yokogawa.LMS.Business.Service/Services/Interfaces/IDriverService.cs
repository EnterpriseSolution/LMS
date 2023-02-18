using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.Data.Infrastructure.DTOs;

namespace Yokogawa.LMS.Business.Services.Interfaces
{
    public interface IDriverService
    {
        Task<PagedCollection<DriverDto>> GetDrivers(IFilter filter);
        Task<DriverDto> GetDriver(Guid id);
        Task<DriverDto> SaveDriver(DriverDto carrierDto, IUserProfile user);
        Task DeleteDriver(Guid id, IUserProfile user);
    }
}
