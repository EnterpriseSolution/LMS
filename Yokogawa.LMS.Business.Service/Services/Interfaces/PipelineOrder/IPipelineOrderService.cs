using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.LMS.Business.Data.DTOs;

namespace Yokogawa.LMS.Business.Services.Interfaces
{
    public interface IPipelineOrderService
    {
        Task<PagedCollection<OdPipelineOrderDto>> GetPipelineOrders(IFilter filter);
        Task<OdPipelineOrderDto> GetPipelineOrder(Guid id);
        Task<OdPipelineOrderDto> SavePipelineOrder(OdPipelineOrderDto pipelineOrderDto, IUserProfile user);
        Task DeletePipelineOrder(Guid id, IUserProfile user);
    }
}
