using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Business.Service.DTOs.IttOrder;
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.LMS.Business.Service.Services.Interfaces.IttOrder
{
    public interface IttOrderService
    {
        Task<PagedCollection<IttOrderDto>> GetIttOrders(IFilter filter);
        Task<IttOrderDto> GetIttOrder(Guid id);
        Task<IttOrderDto> SaveIttOrder(IttOrderDto order, IUserProfile user);
        Task DeleteIttOrder(Guid id, IUserProfile user);
        IttOrderMasterData GetMasterData();
    }
}
