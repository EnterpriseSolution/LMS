using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.LMS.Business.Data;
using Yokogawa.LMS.Business.Data.Commands;
using Yokogawa.LMS.Business.Data.Commands.VesselDischarge;
using Yokogawa.LMS.Business.Data.DTOs;
using Yokogawa.LMS.Business.Data.Entities.PipelineOrder;
using Yokogawa.LMS.Business.Service.Projections.PipelineOrder;
using Yokogawa.LMS.Business.Services.Interfaces;
using Yokogawa.LMS.Exceptions;
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.LMS.Business.Services
{
    public class PipelineOrderService : IPipelineOrderService
    {
        private LMSDBContext _dbContext;
        private readonly ILogger<PipelineOrderService> _logger;

        public PipelineOrderService(LMSDBContext dbContext, ILogger<PipelineOrderService> logger) 
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<PagedCollection<OdPipelineOrderDto>> GetPipelineOrders(IFilter filter)
        {
            return await _dbContext.OdPipelineOrders.ExcludeDeletion().AsNoTracking().GetQuery(filter)
                                            .Select<OdPipelineOrder, OdPipelineOrderDto>(OdPipelineOrderProjection.OdPipelineOrderDto)
                                            .ToPagedCollectionAsync(filter);

        }

        public async Task<OdPipelineOrderDto> GetPipelineOrder(Guid id)
        {
            OdPipelineOrderDto pipelineOrder = id == Guid.Empty ? new OdPipelineOrderDto() { } : null;
            pipelineOrder = pipelineOrder ?? await _dbContext.OdPipelineOrders.GetById(id).ExcludeDeletion().Select(OdPipelineOrderProjection.OdPipelineOrderDto).FirstOrDefaultAsync<OdPipelineOrderDto>();
            
            if (pipelineOrder == null)
                throw new NotFoundCustomException("Record is not found");

            return pipelineOrder;
        }

        public async Task<OdPipelineOrderDto> SavePipelineOrder(OdPipelineOrderDto cardDto, IUserProfile profile)
        {
            var pipelineOrder = await _dbContext.OdPipelineOrders.CreateOrUpdateAsync(cardDto, profile);
            await _dbContext.SaveChangesAsync();
            cardDto.Id = pipelineOrder.Id;
            return cardDto;
        }

        public async Task DeletePipelineOrder(Guid id, IUserProfile user)
        {
            var result = await _dbContext.OdPipelineOrders.DeleteAsync(id, user);
            if (result == null)
                return;

            await _dbContext.SaveChangesAsync();
        }
    }
}
 