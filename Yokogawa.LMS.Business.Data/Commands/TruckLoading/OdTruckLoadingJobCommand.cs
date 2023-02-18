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
using Yokogawa.LMS.Business.Data.Entities.TruckLoading;
using Yokogawa.LMS.Business.Data.DTOs.TruckLoading;
using System.Collections.Generic;

namespace Yokogawa.LMS.Business.Data.Commands.TruckLoading
{
    public static class OdTruckLoadingJobCommand
    {
        public static async Task<OdTruckLoadingJob> ValidatePermissionAsync(this DbSet<OdTruckLoadingJob> dbSet, Guid id)
        {
            OdTruckLoadingJob entity = await dbSet.GetById(id).FirstOrDefaultAsync();

            return entity;
        }

        public static async Task ValidateAsync(this DbSet<OdTruckLoadingJob> dbSet, IOdTruckLoadingJobDto dto)
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

        public static async Task<OdTruckLoadingJob> CreateOrUpdateAsync(this DbSet<OdTruckLoadingJob> dbSet, IOdTruckLoadingJobDto dto, IUserProfile profile)
        {
            dto.SetAudit(profile.UserId, profile.UserName);
            var OdTruckLoadingJob = await dbSet.ValidatePermissionAsync(dto.Id);
            bool isCreate = OdTruckLoadingJob == null;

            if (isCreate)
            {
                OdTruckLoadingJob = new OdTruckLoadingJob();
                OdTruckLoadingJob.Id = Guid.NewGuid();
                dbSet.Add(OdTruckLoadingJob);
            }
            await dbSet.ValidateAsync(dto);

            OdTruckLoadingJob.OrderId = dto.OrderId;
            OdTruckLoadingJob.JobNo = dto.JobNo;
            OdTruckLoadingJob.CompartmentId = dto.CompartmentId;
            OdTruckLoadingJob.ProductId = dto.ProductId;
            OdTruckLoadingJob.TankId = dto.TankId;
            OdTruckLoadingJob.SealNo = dto.SealNo;
            OdTruckLoadingJob.Destination = dto.Destination;
            OdTruckLoadingJob.CustomerId = dto.CustomerId;
            OdTruckLoadingJob.OrderQty = dto.OrderQty;
            OdTruckLoadingJob.LoadedQty = dto.LoadedQty;
            OdTruckLoadingJob.Uom = dto.Uom;
            OdTruckLoadingJob.Status = dto.Status?? 0;
            OdTruckLoadingJob.Remarks = dto.Remarks;
            OdTruckLoadingJob.SetAudit(dto, isCreate, true);
            return OdTruckLoadingJob;
        }

        public static async Task<OdTruckLoadingJob> DeleteAsync(this DbSet<OdTruckLoadingJob> dbSet, Guid id, IUserProfile profile)
        {
            var OdTruckLoadingJob = await dbSet.ValidatePermissionAsync(id);
            bool isDeleted = OdTruckLoadingJob != null;
            if (isDeleted)
                OdTruckLoadingJob.LogicDelete(profile.UserId, profile.UserName, false);

            return OdTruckLoadingJob;
        }

    }
}
