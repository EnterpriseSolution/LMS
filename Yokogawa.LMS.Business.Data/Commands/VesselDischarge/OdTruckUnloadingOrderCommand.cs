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

namespace Yokogawa.LMS.Business.Data.Commands.VesselDischarge
{ 
    public static class OdVesselDischargeOrderCommand
    {
        public static async Task<OdVesselDischargeOrder> ValidatePermissionAsync(this DbSet<OdVesselDischargeOrder> dbSet, Guid id)
        {
            OdVesselDischargeOrder entity = await dbSet.GetById(id).FirstOrDefaultAsync();
            return entity;
        }

        public static async Task ValidateAsync(this DbSet<OdVesselDischargeOrder> dbSet, IVesselDischargeOrderDto dto)
        {
            StringBuilder sb = new StringBuilder();

            bool isDuplicated = await dbSet.ExcludeDeletion().AsNoTracking().Where(o => o.Id != dto.Id && dto.Id != Guid.Empty).CountAsync() > 0;
            if (isDuplicated)
                sb.AppendLine("Duplicate Record");

            if (sb.Length > 0)
                throw new ConflictException(sb.ToString());
        }

        public static async Task<OdVesselDischargeOrder> CreateOrUpdateAsync(this DbSet<OdVesselDischargeOrder> dbSet, IVesselDischargeOrderDto dto, IUserProfile profile)
        {
            dto.SetAudit(profile.UserId, profile.UserName);
            var vesselDischargeOrder = await dbSet.ValidatePermissionAsync(dto.Id);
            bool isCreate = vesselDischargeOrder == null;

            if (isCreate)
            {
                vesselDischargeOrder = new OdVesselDischargeOrder()
                {
                    UOM = (int)UOM.M3
                };                   ;
                vesselDischargeOrder.Id = Guid.NewGuid();
                dbSet.Add(vesselDischargeOrder);
            }
          
            vesselDischargeOrder.IsDeleted = false;
            vesselDischargeOrder.OrderNo = dto.OrderNo;
            vesselDischargeOrder.ShipmentNo = dto.ShipmentNo;

            vesselDischargeOrder.VesselId = dto.VesselId;
            vesselDischargeOrder.OperationType = dto.OperationType;
            vesselDischargeOrder.ETA = dto.ETA;
            vesselDischargeOrder.SourceType = dto.SourceType;

            if (!string.IsNullOrWhiteSpace(dto.ProductId))
                vesselDischargeOrder.ProductId = Guid.Parse(dto.ProductId);

            if (!string.IsNullOrWhiteSpace(dto.JettyId))
                vesselDischargeOrder.JettyId = Guid.Parse(dto.JettyId);           

            vesselDischargeOrder.OrderQty = dto.OrderQty;
            vesselDischargeOrder.LoadedQty = dto.LoadedQty;

            vesselDischargeOrder.Status = dto.Status;
            if (!string.IsNullOrWhiteSpace(dto.CustomerId))
                vesselDischargeOrder.CustomerId = Guid.Parse(dto.CustomerId);

            vesselDischargeOrder.Remarks = dto.Remarks;                     

            vesselDischargeOrder.SetAudit(dto, isCreate, true);

            return vesselDischargeOrder;
        }

        public static async Task<OdVesselDischargeOrder> DeleteAsync(this DbSet<OdVesselDischargeOrder> dbSet, Guid id, IUserProfile profile)
        {
            var truckUnloadingOrder = await dbSet.ValidatePermissionAsync(id);
            bool isDeleted = truckUnloadingOrder != null;
            if (isDeleted)
                truckUnloadingOrder.LogicDelete(profile.UserId, profile.UserName, true);

            return truckUnloadingOrder;
        }
    }
}
