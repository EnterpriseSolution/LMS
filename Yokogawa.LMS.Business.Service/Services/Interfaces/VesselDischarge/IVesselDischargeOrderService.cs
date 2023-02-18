using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.Data.Infrastructure.DTOs;

namespace Yokogawa.LMS.Business.Services.Interfaces
{
    public interface IVesselDischargeOrder
    {
        Task<PagedCollection<VesselDischargeOrderDto>> GetVesselDischargeOrders(IFilter filter);
        Task<VesselDischargeOrderDto> GetVesselDischargeOrder(Guid id);
        Task<VesselDischargeOrderDto> SaveVesselDischargeOrder(VesselDischargeOrderDto carrierDto, IUserProfile user);
        Task DeleteVesselDischargeOrder(Guid id, IUserProfile user);
    }
}
