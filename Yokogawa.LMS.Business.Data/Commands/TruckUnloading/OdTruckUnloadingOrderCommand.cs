using System;
using System.Text;
using System.Linq;
using Yokogawa.Data.Infrastructure.Extensions;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Yokogawa.LMS.Business.Data.DTOs;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.LMS.Exceptions;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Business.Data.Entities;
using Yokogawa.LMS.Business.Data.Entities.TruckUnloading;
using Yokogawa.LMS.Business.Data.DTOs.TruckLoading;
using Yokogawa.LMS.Business.Data.DTOs.TruckUnloading;
using Yokogawa.Data.Infrastructure.Utils;
using Yokogawa.LMS.Business.Data.Enums;

namespace Yokogawa.LMS.Business.Data.Commands.TruckUnloading
{ 
    public static class OdTruckUnloadingOrderCommand
    {
        public static async Task<OdTruckUnloadingOrder> ValidatePermissionAsync(this DbSet<OdTruckUnloadingOrder> dbSet, Guid id)
        {
            OdTruckUnloadingOrder entity = await dbSet.GetById(id).FirstOrDefaultAsync();
            return entity;
        }

        public static async Task ValidateAsync(this DbSet<OdTruckUnloadingOrder> dbSet, IOdTruckLoadingOrderDto dto)
        {
            StringBuilder sb = new StringBuilder();

            bool isDuplicated = await dbSet.ExcludeDeletion().AsNoTracking().Where(o => o.Id != dto.Id && dto.Id != Guid.Empty).CountAsync() > 0;
            if (isDuplicated)
                sb.AppendLine("Duplicate Record");

            if (sb.Length > 0)
                throw new ConflictException(sb.ToString());
        }

        public static async Task<OdTruckUnloadingOrder> CreateOrUpdateAsync(this DbSet<OdTruckUnloadingOrder> dbSet, IOdTruckUnloadingOrder dto, IUserProfile profile)
        {
            dto.SetAudit(profile.UserId, profile.UserName);
            var truckUnloadingOrder = await dbSet.ValidatePermissionAsync(dto.Id);
            bool isCreate = truckUnloadingOrder == null;

            if (isCreate)
            {
                truckUnloadingOrder = new OdTruckUnloadingOrder()
                {
                    UOM = (int)UOM.M3
                };                   ;
                truckUnloadingOrder.Id = Guid.NewGuid();
                dbSet.Add(truckUnloadingOrder);
            }

            if (!string.IsNullOrWhiteSpace(dto.UnloadingDate))
                truckUnloadingOrder.UnloadingDate = MappingUtil.ConvertStringToDateTime(dto.UnloadingDate);

            if (!string.IsNullOrWhiteSpace(dto.CustomerId))
              truckUnloadingOrder.CustomerId = Guid.Parse(dto.CustomerId);
            if (!string.IsNullOrWhiteSpace(dto.ProductId))
                truckUnloadingOrder.ProductId = Guid.Parse(dto.ProductId);

            truckUnloadingOrder.IsDeleted = false;
            truckUnloadingOrder.OrderNo = dto.OrderNo;
            truckUnloadingOrder.OrderQty = dto.OrderQty;          
            truckUnloadingOrder.SourceType = dto.SourceType;
            truckUnloadingOrder.Status = dto.Status;
            if(!string.IsNullOrWhiteSpace(dto.TruckId))
             truckUnloadingOrder.TruckId = Guid.Parse(dto.TruckId);
           
            truckUnloadingOrder.UOM = dto.UOM;

            if(!string.IsNullOrWhiteSpace(dto.CarrierId))
            truckUnloadingOrder.CarrierId = Guid.Parse(dto.CarrierId);
            if (!string.IsNullOrWhiteSpace(dto.TruckId))
                truckUnloadingOrder.TruckId = Guid.Parse(dto.TruckId);
            truckUnloadingOrder.FrontLicense = dto.FrontLicense;
            truckUnloadingOrder.RearLicense = dto.RearLicense;
            if (!string.IsNullOrWhiteSpace(dto.CardId))
                truckUnloadingOrder.CardId = Guid.Parse(dto.CardId);
            if (!string.IsNullOrWhiteSpace(dto.DriverId))
                truckUnloadingOrder.DriverId = Guid.Parse(dto.DriverId);

            truckUnloadingOrder.BayNo = dto.BayNo;
            truckUnloadingOrder.Remarks = dto.Remarks;
            truckUnloadingOrder.OrderQty = dto.OrderQty;
            truckUnloadingOrder.UnloadingQty = dto.UnloadingQty;                       

            truckUnloadingOrder.SetAudit(dto, isCreate, true);

            return truckUnloadingOrder;
        }

        public static async Task<OdTruckUnloadingOrder> DeleteAsync(this DbSet<OdTruckUnloadingOrder> dbSet, Guid id, IUserProfile profile)
        {
            var truckUnloadingOrder = await dbSet.ValidatePermissionAsync(id);
            bool isDeleted = truckUnloadingOrder != null;
            if (isDeleted)
                truckUnloadingOrder.LogicDelete(profile.UserId, profile.UserName, true);

            return truckUnloadingOrder;
        }
    }
}
