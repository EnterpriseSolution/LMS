using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.Data.Infrastructure.Extensions;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Data.Infrastructure.Utils;
using Yokogawa.LMS.Business.Data.Entities.PipelineOrder;
using Yokogawa.LMS.Business.Data.Enums;
using Yokogawa.LMS.Exceptions;
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.LMS.Business.Data.Commands.VesselDischarge
{
    public static class OdPipelineOrderCommand
    {
        public static async Task<OdPipelineOrder> ValidatePermissionAsync(this DbSet<OdPipelineOrder> dbSet, Guid id)
        {
            OdPipelineOrder entity = await dbSet.GetById(id).FirstOrDefaultAsync();
            return entity;
        }

        public static async Task ValidateAsync(this DbSet<OdPipelineOrder> dbSet, IOdPipelineOrderDto dto)
        {
            StringBuilder sb = new StringBuilder();

            bool isDuplicated = await dbSet.ExcludeDeletion().AsNoTracking().Where(o => o.Id != dto.Id && dto.Id != Guid.Empty).CountAsync() > 0;
            if (isDuplicated)
                sb.AppendLine("Duplicate Record");

            if (sb.Length > 0)
                throw new ConflictException(sb.ToString());
        }

        public static async Task<OdPipelineOrder> CreateOrUpdateAsync(this DbSet<OdPipelineOrder> dbSet, IOdPipelineOrderDto dto, IUserProfile profile)
        {
            dto.SetAudit(profile.UserId, profile.UserName);
            var odPipelineOrder = await dbSet.ValidatePermissionAsync(dto.Id);
            bool isCreate = odPipelineOrder == null;

            if (isCreate)
            {
                odPipelineOrder = new OdPipelineOrder()
                {
                    UOM = (int)UOM.M3
                };                   ;
                odPipelineOrder.Id = Guid.NewGuid();
                dbSet.Add(odPipelineOrder);
            }
          
            odPipelineOrder.IsDeleted = false;
            odPipelineOrder.OrderNo = dto.OrderNo;            
            if (!string.IsNullOrWhiteSpace(dto.DeliveryDate))
                odPipelineOrder.DeliveryDate = MappingUtil.ConvertStringToDateTime(dto.DeliveryDate);

            odPipelineOrder.SourceType = dto.SourceType;

            if (!string.IsNullOrWhiteSpace(dto.ProductId))
                odPipelineOrder.ProductId = Guid.Parse(dto.ProductId);

            odPipelineOrder.Status = dto.Status;
            if (!string.IsNullOrWhiteSpace(dto.CustomerId))
                odPipelineOrder.CustomerId = Guid.Parse(dto.CustomerId);

            odPipelineOrder.Destination = dto.Destination;
            odPipelineOrder.Remarks = dto.Remarks;                     
            odPipelineOrder.SetAudit(dto, isCreate, true);

            return odPipelineOrder;
        }

        public static async Task<OdPipelineOrder> DeleteAsync(this DbSet<OdPipelineOrder> dbSet, Guid id, IUserProfile profile)
        {
            var truckUnloadingOrder = await dbSet.ValidatePermissionAsync(id);
            bool isDeleted = truckUnloadingOrder != null;
            if (isDeleted)
                truckUnloadingOrder.LogicDelete(profile.UserId, profile.UserName, true);

            return truckUnloadingOrder;
        }
    }
}
