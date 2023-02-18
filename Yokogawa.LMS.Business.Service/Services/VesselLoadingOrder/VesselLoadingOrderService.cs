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
using Yokogawa.LMS.Business.Service.DTOs.VesselLoadingOrder;
using Yokogawa.LMS.Business.Service.Projections.VesselLoadingOrder;
using Yokogawa.LMS.Business.Data.Entities.VesselLoading;
using Yokogawa.LMS.Business.Data.Commands.VesselLoadingOrder;
using Yokogawa.LMS.Business.Service.Services.Interfaces.VesselLoadingOrder;


namespace Yokogawa.LMS.Business.Service.Services.VesselLoadingOrder
{
    public class VesselLoadingOrderService:IVesselLoadingOrderService
    {
        private LMSDBContext _dbContext;
        private readonly ILogger<VesselLoadingOrderService> _logger;
        public VesselLoadingOrderService(LMSDBContext dbContext, ILogger<VesselLoadingOrderService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<PagedCollection<VesselLoadingOrderDto>> GetVesselLoadingOrders(IFilter filter)
        {
           var data=  await _dbContext.OdVesselLoadingOrders.ExcludeDeletion()
                            .Include(p => p.Vessel)
                            .Include(p=>p.Product)
                            .Include(p=>p.Jetty)
                            .Include(p=>p.Customer)
                            .Select(VesselLoadingOrderProjection.VesselLoadingOrderListDto)
                            .ToPagedCollectionAsync(filter);
            return data;
        }

        public async Task<VesselLoadingOrderDto> GetVesselLoadingOrder(Guid id)
        {
            VesselLoadingOrderDto VesselLoadingOrder = id == Guid.Empty ? new VesselLoadingOrderDto() { } : null;
            VesselLoadingOrder = VesselLoadingOrder ?? await _dbContext.OdVesselLoadingOrders.
               GetById(id).ExcludeDeletion().Select(VesselLoadingOrderProjection.VesselLoadingOrderDto).FirstOrDefaultAsync<VesselLoadingOrderDto>();

            if (VesselLoadingOrder == null)
                throw new NotFoundCustomException("Record is not found");

            return VesselLoadingOrder;
        }

        public VesselLoadingOrderMasterData GetMasterData()
        {
            VesselLoadingOrderMasterData data = new VesselLoadingOrderMasterData();

            data.VesselList = _dbContext.Vessels.Select(en => new VesselLoadingOrderMasterDataItem { value = en.Id.ToString(), text = en.VesselName }).ToList();
            data.ProductList = _dbContext.Products.Select(en => new VesselLoadingOrderMasterDataItem { value = en.Id.ToString(), text = en.ProductName }).ToList();
            data.JettyList = _dbContext.Jetties.Select(en => new VesselLoadingOrderMasterDataItem { value = en.Id.ToString(), text = en.JettyNo }).ToList();
            data.CustomerList = _dbContext.Customers.Select(en => new VesselLoadingOrderMasterDataItem { value = en.Id.ToString(), text = en.CustomerName }).ToList();

            return data;
        }

        public async Task<VesselLoadingOrderDto> SaveVesselLoadingOrder(VesselLoadingOrderDto VesselLoadingOrderDto, IUserProfile profile)
        {
            var VesselLoadingOrder = await _dbContext.OdVesselLoadingOrders.CreateOrUpdateAsync(VesselLoadingOrderDto, profile);
            await _dbContext.SaveChangesAsync();
            VesselLoadingOrderDto.Id = VesselLoadingOrder.Id;
            return VesselLoadingOrderDto;
        }

        public async Task DeleteVesselLoadingOrder(Guid id, IUserProfile user)
        {
            var result = await _dbContext.OdVesselLoadingOrders.DeleteAsync(id, user);
            if (result == null)
                return;

            await _dbContext.SaveChangesAsync();
        }
    }
}
