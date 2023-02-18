using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.LMS.Business.Service.DTOs.TruckLoading;
using Yokogawa.LMS.Business.Service.DTOs.TruckUnloading;

namespace Yokogawa.LMS.Business.Service.Services.Interfaces.TruckUnloading
{
    public interface ITruckUnloadingOrderService
    {
        Task<PagedCollection<OdTruckUnloadingOrderDto>> GetOdTruckUnLoadingOrders(IFilter filter);
        Task<OdTruckUnloadingOrderDto> GetOdTruckUnLoadingOrder(Guid id);
        Task<OdTruckUnloadingOrderDto> SaveOdTruckUnLoadingOrder(OdTruckUnloadingOrderDto odTruckUnloading, IUserProfile user);
        bool CheckOrderExist(string orderNo);
        Task DeleteOdTruckUnLoadingOrder(Guid id, IUserProfile user);
    }
}
