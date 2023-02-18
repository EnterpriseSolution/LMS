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


using System.Collections.Generic;
using Yokogawa.LMS.Business.Data.Entities.VesselLoading;

using Yokogawa.LMS.Business.Data.DTOs.VesselLoadingOrder;

namespace Yokogawa.LMS.Business.Data.Commands.VesselLoadingOrder
{
    public static class VesselLoadingOrderCommand
    {

        public static async Task<OdVesselLoadingOrder> ValidatePermissionAsync(this DbSet<OdVesselLoadingOrder> dbSet, Guid id)
        {
            OdVesselLoadingOrder entity = await dbSet.GetById(id).FirstOrDefaultAsync();

            return entity;
        }

        public static async Task ValidateAsync(this DbSet<OdVesselLoadingOrder> dbSet, IVesselLoadingOrderDto dto)
        {
            StringBuilder sb = new StringBuilder();
            List<Guid> RestIdList = await dbSet.ExcludeDeletion().AsNoTracking().Where(o => o.Id != dto.Id && dto.Id != Guid.Empty).Select(p => p.Id).ToListAsync();

            if (dto.Id != Guid.Empty && RestIdList.Contains(dto.Id))
            {
                sb.AppendLine("Duplicate Record");
            }

           if (sb.Length > 0)
                throw new ConflictException(sb.ToString());
        }



        public static async Task<OdVesselLoadingOrder> CreateOrUpdateAsync(this DbSet<OdVesselLoadingOrder> dbSet, IVesselLoadingOrderDto dto, IUserProfile profile)
        {
            dto.SetAudit(profile.UserId, profile.UserName);
            var OdVesselLoadingOrder = await dbSet.ValidatePermissionAsync(dto.Id);
            bool isCreate = OdVesselLoadingOrder == null;

            if (isCreate)
            {
                OdVesselLoadingOrder = new OdVesselLoadingOrder();
                OdVesselLoadingOrder.Id = Guid.NewGuid();
                dbSet.Add(OdVesselLoadingOrder);
            }
            await dbSet.ValidateAsync(dto);
            
            OdVesselLoadingOrder.Destination = dto.Destination;
            OdVesselLoadingOrder.Eta = dto.Eta;
            OdVesselLoadingOrder.LoadedQty = dto.LoadedQty;
            OdVesselLoadingOrder.OperationType = dto.OperationType;
            OdVesselLoadingOrder.OrderNo = dto.OrderNo;
            OdVesselLoadingOrder.OrderQty = dto.OrderQty;
            OdVesselLoadingOrder.Remarks = dto.Remarks;
            OdVesselLoadingOrder.ShipmentNo = dto.ShipmentNo;
            OdVesselLoadingOrder.SourceType = dto.SourceType;
            OdVesselLoadingOrder.Status = dto.Status;
            OdVesselLoadingOrder.Uom = dto.Uom;
            OdVesselLoadingOrder.VesselId = Guid.Parse(dto.St_VesselId);
            OdVesselLoadingOrder.ProductId = Guid.Parse(dto.St_ProductId);
            OdVesselLoadingOrder.JettyId = GenrateGuid(dto.St_JettyId);
            OdVesselLoadingOrder.CustomerId = GenrateGuid(dto.St_CustomerId);
            OdVesselLoadingOrder.SetAudit(dto, isCreate, true);
            return OdVesselLoadingOrder;
        }

        public static async Task<OdVesselLoadingOrder> DeleteAsync(this DbSet<OdVesselLoadingOrder> dbSet, Guid id, IUserProfile profile)
        {
            var OdVesselLoadingOrder = await dbSet.ValidatePermissionAsync(id);
            bool isDeleted = OdVesselLoadingOrder != null;
            if (isDeleted)
                OdVesselLoadingOrder.LogicDelete(profile.UserId, profile.UserName, false);

            return OdVesselLoadingOrder;
        }

        public static Guid? GenrateGuid(String St_Id)
        {
            Guid? id = null;
            if (string.IsNullOrWhiteSpace(St_Id))
            {
                id = null;
            }
            else
            {
                id = Guid.Parse(St_Id);
            }
            return id;
        }
    }
}
