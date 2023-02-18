using System;
using System.Collections.Generic;
using Yokogawa.LMS.Business.Service.DTOs.VesselLoadingOrder;
using Yokogawa.LMS.Business.Service.Projections.VesselLoadingOrder;
using Yokogawa.LMS.Business.Data.Entities.VesselLoading;
using System.Text;
using Yokogawa.Data.Infrastructure.DTOs;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.LMS.Business.Service.Services.Interfaces.VesselLoadingOrder
{
    public interface IVesselLoadingOrderService
    {
        Task<PagedCollection<VesselLoadingOrderDto>> GetVesselLoadingOrders(IFilter filter);
        Task<VesselLoadingOrderDto> GetVesselLoadingOrder(Guid id);
        Task<VesselLoadingOrderDto> SaveVesselLoadingOrder(VesselLoadingOrderDto jetty, IUserProfile user);
        Task DeleteVesselLoadingOrder(Guid id, IUserProfile user);

        VesselLoadingOrderMasterData GetMasterData();
    }
}
