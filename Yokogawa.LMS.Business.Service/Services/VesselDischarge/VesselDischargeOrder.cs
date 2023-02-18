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
using Yokogawa.LMS.Business.Services.Interfaces;
using Yokogawa.LMS.Business.Data;
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.LMS.Business.Data.Entities;
using Yokogawa.LMS.Business.Service.Projections;
using Yokogawa.LMS.Business.Data.Commands;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.LMS.Business.Data.Commands.VesselDischarge;
using Yokogawa.LMS.Business.Data.Enums;

namespace Yokogawa.LMS.Business.Services
{
    public class VesselDischargeOrder : IVesselDischargeOrder
    {
        private LMSDBContext _dbContext;
        private readonly ILogger<VesselDischargeOrder> _logger;

        public VesselDischargeOrder(LMSDBContext dbContext, ILogger<VesselDischargeOrder> logger) 
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<PagedCollection<VesselDischargeOrderDto>> GetVesselDischargeOrders(IFilter filter)
        {
            var list = await _dbContext.OdVesselDischargeOrders.ExcludeDeletion().AsNoTracking().GetQuery(filter)
                                           .Select<OdVesselDischargeOrder, VesselDischargeOrderDto>(VesselDischargeOrderProjection.VesselDischargeOrderDto)
                                           .ToPagedCollectionAsync(filter);
            var customerList = _dbContext.Customers.ExcludeDeletion().AsNoTracking()
                                            .Select<Customer, CustomerDto>(CustomerProjection.CustomerDto).ToList();
            var productList = _dbContext.Products.ExcludeDeletion().AsNoTracking()
                                           .Select<Product, ProductDto>(ProductProjection.ProductDto).ToList();
            foreach (VesselDischargeOrderDto dto in list.Items)
            {
                dto.OperationTypeDescription = UtilEnum.GetDescription(typeof(EnumOrderSourceTypeStatus), dto.OperationType);
                dto.UOMDescription = UtilEnum.GetDescription(typeof(UOM), dto.UOM);
                dto.StatusDescription = UtilEnum.GetDescription(typeof(EnumVesselDischargeOrderStatus), dto.Status);

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

        public async Task<VesselDischargeOrderDto> GetVesselDischargeOrder(Guid id)
        {
            VesselDischargeOrderDto vesselDischarge = id == Guid.Empty ? new VesselDischargeOrderDto() { } : null;
            vesselDischarge = vesselDischarge ?? await _dbContext.OdVesselDischargeOrders.GetById(id).ExcludeDeletion().Select(VesselDischargeOrderProjection.VesselDischargeOrderDto).FirstOrDefaultAsync<VesselDischargeOrderDto>();
            
            if (vesselDischarge == null)
                throw new NotFoundCustomException("Record is not found");

            return vesselDischarge;
        }

        public async Task<VesselDischargeOrderDto> SaveVesselDischargeOrder(VesselDischargeOrderDto driverDto, IUserProfile profile)
        {
            var vesselDischarge = await _dbContext.OdVesselDischargeOrders.CreateOrUpdateAsync(driverDto, profile);
            await _dbContext.SaveChangesAsync();
            driverDto.Id = vesselDischarge.Id;
            return driverDto;
        }

        public async Task DeleteVesselDischargeOrder(Guid id, IUserProfile user)
        {
            var result = await _dbContext.OdVesselDischargeOrders.DeleteAsync(id, user);
            if (result == null)
                return;

            await _dbContext.SaveChangesAsync();
        }
    }
}
 