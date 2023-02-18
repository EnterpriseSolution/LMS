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
using Yokogawa.LMS.Business.Data.DTOs.IttOrder;

using Yokogawa.LMS.Business.Data.Entities.IttOrder;

namespace Yokogawa.LMS.Business.Data.Commands.IttOrders
{
   public static class IttOrderCommands
    {
        public static async Task<OdIttOrder> ValidatePermissionAsync(this DbSet<OdIttOrder> dbSet, Guid id)
        {
            OdIttOrder entity = await dbSet.GetById(id).FirstOrDefaultAsync();

            return entity;
        }

        public static async Task ValidateAsync(this DbSet<OdIttOrder> dbSet, IIttOrderDto dto)
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



        public static async Task<OdIttOrder> CreateOrUpdateAsync(this DbSet<OdIttOrder> dbSet, IIttOrderDto dto, IUserProfile profile)
        {
            dto.SetAudit(profile.UserId, profile.UserName);
            var IttOrder = await dbSet.ValidatePermissionAsync(dto.Id);
            bool isCreate = IttOrder == null;

            if (isCreate)
            {
                IttOrder = new OdIttOrder();
                IttOrder.Id = Guid.NewGuid();
                dbSet.Add(IttOrder);
            }
            await dbSet.ValidateAsync(dto);
            IttOrder.DeliveryDate = dto.DeliveryDate;
            IttOrder.OrderNo = dto.OrderNo;
            IttOrder.OrderQty = dto.OrderQty;
            IttOrder.Remarks = dto.Remarks;
            IttOrder.SourceType = dto.SourceType;
            IttOrder.Status = dto.Status;
            IttOrder.FromTankId = Guid.Parse(dto.St_FromTankId); 
            IttOrder.FinalProductId = Guid.Parse(dto.St_FinalProductId);
            IttOrder.FromCustomerId = Guid.Parse(dto.St_FromCustomerId);
            IttOrder.ToCustomerId = Guid.Parse(dto.St_ToCustomerId);
            IttOrder.ToTankId = Guid.Parse(dto.St_ToTankId);
            IttOrder.TransferredQty = dto.TransferredQty;
            IttOrder.Uom = dto.Uom;
            IttOrder.SetAudit(dto, isCreate, true);

            return IttOrder;
        }

        public static async Task<OdIttOrder> DeleteAsync(this DbSet<OdIttOrder> dbSet, Guid id, IUserProfile profile)
        {
            var IttOrder = await dbSet.ValidatePermissionAsync(id);
            bool isDeleted = IttOrder != null;
            if (isDeleted)
                IttOrder.LogicDelete(profile.UserId, profile.UserName, false);

            return IttOrder;
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
