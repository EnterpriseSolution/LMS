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

using Yokogawa.LMS.Business.Data.Commands.TruckLoading;
using Yokogawa.LMS.Business.Service.DTOs.IttOrder;



using Yokogawa.LMS.Business.Service.Services.Interfaces.IttOrder;
using Yokogawa.LMS.Business.Service.Projections.IttOrderDtos;
using Yokogawa.LMS.Business.Data.Commands.IttOrders;
using Yokogawa.LMS.Business.Data.Entities.IttOrder;

namespace Yokogawa.LMS.Business.Service.Services.IttOrder
{
    public class IttOrderService_Implement: IttOrderService
    {
        private LMSDBContext _dbContext;
        private readonly ILogger<IttOrderService> _logger;
        public IttOrderService_Implement(LMSDBContext dbContext, ILogger<IttOrderService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<PagedCollection<IttOrderDto>> GetIttOrders(IFilter filter)
        {
           return await _dbContext.OdIttOrders
                           .Include(p => p.FromCustomer)
                           .Include(p => p.ToCustomer)
                           .Include(p => p.FromTank)
                           .Include(p => p.ToTank)
                           .Include(p => p.FinalProduct)
                           .ExcludeDeletion().GetQuery(filter).Select<OdIttOrder, IttOrderDto>(IttOrderProjection.IttOrderDtoList)
                           .ToPagedCollectionAsync(filter); 
        }

        public async Task<IttOrderDto> GetIttOrder(Guid id)
        {
            IttOrderDto IttOrder = id == Guid.Empty ? new IttOrderDto() { } : null;
            IttOrder = IttOrder ?? await _dbContext.OdIttOrders.GetById(id).
                ExcludeDeletion().Select(IttOrderProjection.IttOrderDto).FirstOrDefaultAsync<IttOrderDto>();

            if (IttOrder == null)
                throw new NotFoundCustomException("Record is not found");

            return IttOrder;
        }

        public IttOrderMasterData GetMasterData()
        {
            IttOrderMasterData data = new IttOrderMasterData();

            data.ProductList = _dbContext.Products.Select(en => new IttOrderMasterDataItem { value = en.Id.ToString(), text = en.ProductName }).ToList();
            data.TankList = _dbContext.Tanks.Select(en => new IttOrderMasterDataItem { value = en.Id.ToString(), text = en.TankNo }).ToList();
            data.CustomerList = _dbContext.Customers.Select(en => new IttOrderMasterDataItem { value = en.Id.ToString(), text = en.CustomerName }).ToList();
            return data;
        }

        public async Task<IttOrderDto> SaveIttOrder(IttOrderDto IttOrderDto, IUserProfile profile)
        {
            var IttOrder = await _dbContext.OdIttOrders.CreateOrUpdateAsync(IttOrderDto, profile);
            await _dbContext.SaveChangesAsync();
            IttOrderDto.Id = IttOrder.Id;
            return IttOrderDto;
        }

        public async Task DeleteIttOrder(Guid id, IUserProfile user)
        {
            var result = await _dbContext.OdIttOrders.DeleteAsync(id, user);
            if (result == null)
                return;

            await _dbContext.SaveChangesAsync();
        }
    }
}

