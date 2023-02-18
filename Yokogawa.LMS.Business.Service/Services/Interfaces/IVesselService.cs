using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.Data.Infrastructure.DTOs;

namespace Yokogawa.LMS.Business.Services.Interfaces
{
    public interface IVesselService
    {
        Task<PagedCollection<VesselDto>> GetVessels(IFilter filter);
        Task<VesselDto> GetVessel(Guid id);
        Task<VesselDto> SaveVessel(VesselDto vessel, IUserProfile user);
        Task DeleteVessel(Guid id, IUserProfile user);
        bool CheckVessel(string vesselName);
    }
}
