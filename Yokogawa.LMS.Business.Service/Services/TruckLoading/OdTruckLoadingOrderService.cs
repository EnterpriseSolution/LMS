using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Exceptions;
using Yokogawa.LMS.Business.Data;
using Yokogawa.LMS.Business.Data.Commands;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.LMS.Business.Service.Services.Interfaces.TruckLoading;
using Yokogawa.LMS.Business.Service.DTOs.TruckLoading;
using Yokogawa.LMS.Business.Data.Entities.TruckLoading;
using Yokogawa.LMS.Business.Service.Projections.TruckLoading;
using Yokogawa.LMS.Business.Data.Commands.TruckLoading;


namespace Yokogawa.LMS.Business.Service.Services.TruckLoading
{
   public class OdTruckLoadingOrderService : IOdTruckLoadingOrderService
    {
        private LMSDBContext _dbContext;
        private readonly ILogger<OdTruckLoadingOrderService> _logger;
        public OdTruckLoadingOrderService(LMSDBContext dbContext, ILogger<OdTruckLoadingOrderService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<PagedCollection<OdTruckLoadingOrderDto>> GetOdTruckLoadingOrders(IFilter filter)
        {
            return await _dbContext.OdTruckLoadingOrders.ExcludeDeletion().AsNoTracking().GetQuery(filter)
                                          .Select<OdTruckLoadingOrder, OdTruckLoadingOrderDto>(OdTruckLoadingOrderProjection.OdTruckLoadingOrderListDto)
                                          .ToPagedCollectionAsync(filter);

        }

        public async Task<OdTruckLoadingOrderDto> GetOdTruckLoadingOrder(Guid id)
        {
            OdTruckLoadingOrderDto OdTruckLoadingOrder = id == Guid.Empty ? new OdTruckLoadingOrderDto() { } : null;
            OdTruckLoadingOrder = OdTruckLoadingOrder ?? await _dbContext.OdTruckLoadingOrders.
                Where(p => p.Id == id).
                Include(p => p.OdTruckLoadingJobs).ThenInclude(p => p.Compartment).
                Include(p => p.OdTruckLoadingJobs).ThenInclude(p => p.Product).
                Include(p => p.OdTruckLoadingJobs).ThenInclude(p => p.Tank).
                Include(p => p.OdTruckLoadingJobs).ThenInclude(p => p.Customer).
                ExcludeDeletion().Select(OdTruckLoadingOrderProjection.OdTruckLoadingOrderDto).
                FirstOrDefaultAsync<OdTruckLoadingOrderDto>();

            if (OdTruckLoadingOrder == null)
                throw new NotFoundCustomException("Record is not found");

            return OdTruckLoadingOrder;
        }

        public async Task<OdTruckLoadingOrderDto> SaveOdTruckLoadingOrder(OdTruckLoadingOrderDto Order, IUserProfile profile)
        {
            var OdTruckLoadingOrder = await _dbContext.OdTruckLoadingOrders.CreateOrUpdateAsync(Order, Order.OdTruckLoadingJobDtos, profile);
            await _dbContext.SaveChangesAsync();
            Order.Id = OdTruckLoadingOrder.Id;
            return Order;
        }

        public async Task DeleteOdTruckLoadingOrder(Guid id, IUserProfile user)
        {
            var result = await _dbContext.OdTruckLoadingOrders.DeleteAsync(id, user);
            if (result == null)
                return;

            await _dbContext.SaveChangesAsync();
        }

        public async Task<OdTruckLoadingOrderDto> ChangeOdTruckLoadingOrderStatus(OdTruckLoadingOrderDto Order, IUserProfile user) {
            var order = await _dbContext.OdTruckLoadingOrders.CreateOrUpdateAsync(Order, Order.OdTruckLoadingJobDtos, user);
            await _dbContext.SaveChangesAsync();
            return Order;
        }
    }
}
