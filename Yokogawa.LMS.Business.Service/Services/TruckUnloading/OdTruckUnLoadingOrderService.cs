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
using Yokogawa.LMS.Business.Service.Services.Interfaces.TruckUnloading;
using Yokogawa.LMS.Business.Service.DTOs.TruckUnloading;
using Yokogawa.LMS.Business.Data.Entities.TruckUnloading;
using Yokogawa.LMS.Business.Data.Commands.TruckUnloading;
using Yokogawa.LMS.Business.Data.Enums;
using Yokogawa.LMS.Business.Data.Entities;
using Yokogawa.LMS.Business.Service.Projections;
using Yokogawa.LMS.Business.Service.DTOs;

namespace Yokogawa.LMS.Business.Service.Services.TruckLoading
{
   public class TruckUnloadingOrderService : ITruckUnloadingOrderService
    {
        private LMSDBContext _dbContext;
        private readonly ILogger<TruckUnloadingOrderService> _logger;

        public TruckUnloadingOrderService(LMSDBContext dbContext, ILogger<TruckUnloadingOrderService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<PagedCollection<OdTruckUnloadingOrderDto>> GetOdTruckUnLoadingOrders(IFilter filter)
        {
            var list= await _dbContext.OdTruckUnloadingOrders.ExcludeDeletion().AsNoTracking().GetQuery(filter)
                                          .Select<OdTruckUnloadingOrder, OdTruckUnloadingOrderDto>(OdTruckUnLoadingOrderProjection.OdTruckUnLoadingOrderDto)
                                          .ToPagedCollectionAsync(filter);
            var customerList = _dbContext.Customers.ExcludeDeletion().AsNoTracking()
                                            .Select<Customer, CustomerDto>(CustomerProjection.CustomerDto).ToList();
            var productList = _dbContext.Products.ExcludeDeletion().AsNoTracking()
                                           .Select<Product, ProductDto>(ProductProjection.ProductDto).ToList();
            foreach (OdTruckUnloadingOrderDto dto in list.Items)
            {
                dto.SourceTypeDescription = UtilEnum.GetDescription(typeof(EnumOrderSourceTypeStatus), dto.SourceType);
                dto.UOMDescription = UtilEnum.GetDescription(typeof(UOM), dto.UOM);
                dto.StatusDescription = UtilEnum.GetDescription(typeof(EnumTruckUnloadingOrderStatus), dto.Status);

                if (!string.IsNullOrWhiteSpace(dto.CustomerId))
                {
                    var customer = customerList.FirstOrDefault(en => en.Id == Guid.Parse(dto.CustomerId));
                    if (customer != null)
                    {
                        dto.CustomerName = customer.CustomerName;
                    }
                }
                if (!string.IsNullOrWhiteSpace(dto.ProductId))
                {
                    var product = productList.FirstOrDefault(en => en.Id == Guid.Parse(dto.ProductId));
                    if (product != null)
                    {
                        dto.ProductName = product.ProductName;
                    }
                }
            }

            return list;
        }

        public async Task<OdTruckUnloadingOrderDto> GetOdTruckUnLoadingOrder(Guid id)
        {
            OdTruckUnloadingOrderDto truckUnLoadingOrder = id == Guid.Empty ? new OdTruckUnloadingOrderDto()
            {
                SourceType=(int)EnumOrderSourceTypeStatus.Manual,
                UOM = (int)UOM.M3,
                Status=(int)EnumTruckUnloadingOrderStatus.Defined,
            } : null;

            truckUnLoadingOrder = truckUnLoadingOrder ?? await _dbContext.OdTruckUnloadingOrders.GetById(id).ExcludeDeletion().Select(OdTruckUnLoadingOrderProjection.OdTruckUnLoadingOrderDto).FirstOrDefaultAsync<OdTruckUnloadingOrderDto>();

            truckUnLoadingOrder.SourceTypeDescription = UtilEnum.GetDescription(typeof(EnumOrderSourceTypeStatus), truckUnLoadingOrder.SourceType);
            truckUnLoadingOrder.UOMDescription = UtilEnum.GetDescription(typeof(UOM), truckUnLoadingOrder.UOM);
            truckUnLoadingOrder.StatusDescription = UtilEnum.GetDescription(typeof(EnumTruckUnloadingOrderStatus), truckUnLoadingOrder.Status);

            if (!string.IsNullOrWhiteSpace(truckUnLoadingOrder.CustomerId))
            {
                Guid customerId = Guid.Parse(truckUnLoadingOrder.CustomerId);
                var customer = _dbContext.Customers.ExcludeDeletion().AsNoTracking().FirstOrDefault(en => en.Id == customerId);
                if (customer != null)
                {
                    truckUnLoadingOrder.CustomerName = customer.CustomerName;
                }                          
            }

            if (!string.IsNullOrWhiteSpace(truckUnLoadingOrder.ProductId))
            {
                Guid productId = Guid.Parse(truckUnLoadingOrder.ProductId);
                var product = _dbContext.Products.ExcludeDeletion().AsNoTracking().FirstOrDefault(en => en.Id == productId);
                if (product != null)
                {
                    truckUnLoadingOrder.ProductName = product.ProductName;
                }
            }           

            return truckUnLoadingOrder;
        }

        public bool CheckOrderExist(string orderNo)
        {
            return _dbContext.OdTruckUnloadingOrders.FirstOrDefault(en => en.OrderNo == orderNo) == null;
        }

        public TruckUnloadingOrderMasterData GetMasterData()
        {
            TruckUnloadingOrderMasterData data = new TruckUnloadingOrderMasterData();

            data.CustomerList = _dbContext.Customers.Select(en => new TruckUnloadingOrderMasterDataItem { value = en.Id.ToString(), text = en.CustomerName }).ToList();
            data.ProductList = _dbContext.Products.Select(en => new TruckUnloadingOrderMasterDataItem { value = en.Id.ToString(), text = en.ProductName }).ToList();
            data.CarrierList = _dbContext.Carriers.Select(en => new TruckUnloadingOrderMasterDataItem { value = en.Id.ToString(), text = en.CarrierName }).ToList();
            data.TruckList = _dbContext.Trucks.Select(en => new TruckUnloadingOrderMasterDataItem { value = en.Id.ToString(), text = en.TruckCode }).ToList();
            data.CardList = _dbContext.RFIDCards.Select(en => new TruckUnloadingOrderMasterDataItem { value = en.Id.ToString(), text = en.CardNo }).ToList();
            data.DriverList = _dbContext.Drivers.Select(en => new TruckUnloadingOrderMasterDataItem { value = en.Id.ToString(), text = en.DriverName }).ToList();

            return data;
        }

        public async Task<OdTruckUnloadingOrderDto> SaveOdTruckUnLoadingOrder(OdTruckUnloadingOrderDto OdTruckLoadingOrderDto, IUserProfile profile)
        {
            var OdTruckLoadingOrder = await _dbContext.OdTruckUnloadingOrders.CreateOrUpdateAsync(OdTruckLoadingOrderDto, profile);
            await _dbContext.SaveChangesAsync();
            OdTruckLoadingOrderDto.Id = OdTruckLoadingOrder.Id;
            return OdTruckLoadingOrderDto;
        }

        public async Task DeleteOdTruckUnLoadingOrder(Guid id, IUserProfile user)
        {
            var result = await _dbContext.OdTruckUnloadingOrders.DeleteAsync(id, user);
            if (result == null)
                return;

            await _dbContext.SaveChangesAsync();
        }

        public bool ChangeOrderStatus(string orderNo, int status)
        {
            var order = _dbContext.OdTruckUnloadingOrders.FirstOrDefault(en => en.OrderNo == orderNo);
            if (order == null)
                return false;

            if (order.Status == status)
                return false;

            order.Status = status;
            _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
