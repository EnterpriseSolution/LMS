using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.LMS.Business.Service.DTOs.TruckLoading;


namespace Yokogawa.LMS.Business.Service.Services.Interfaces.TruckLoading
{
    public interface IOdTruckLoadingOrderService
    {
        Task<PagedCollection<OdTruckLoadingOrderDto>> GetOdTruckLoadingOrders(IFilter filter);
        Task<OdTruckLoadingOrderDto> GetOdTruckLoadingOrder(Guid id);
        Task<OdTruckLoadingOrderDto> SaveOdTruckLoadingOrder(OdTruckLoadingOrderDto Order, IUserProfile user);
        Task DeleteOdTruckLoadingOrder(Guid id, IUserProfile user);

       Task<OdTruckLoadingOrderDto> ChangeOdTruckLoadingOrderStatus(OdTruckLoadingOrderDto Order, IUserProfile user);
    }
}
