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

namespace Yokogawa.LMS.Business.Data.Commands
{
    public static class CarrierCommands
    {
        public static async Task<Carrier> ValidatePermissionAsync(this DbSet<Carrier> dbSet, Guid id)
        {
            Carrier entity = await dbSet.GetById(id).FirstOrDefaultAsync();

            return entity;
        }

        public static async Task ValidateAsync(this DbSet<Carrier> dbSet, ICarrierDto dto)
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

        public static async Task<Carrier> CreateOrUpdateAsync(this DbSet<Carrier> dbSet, ICarrierDto dto, IUserProfile profile)
        {
            dto.SetAudit(profile.UserId, profile.UserName);
            var carrier = await dbSet.ValidatePermissionAsync(dto.Id);
            bool isCreate = carrier == null;

            if (isCreate)
            {
                carrier = new Carrier();
                carrier.Id = Guid.NewGuid(); 
                dbSet.Add(carrier);
            }
            await dbSet.ValidateAsync(dto);

            carrier.CarrierCode = dto.CarrierCode;
            carrier.CarrierName = dto.CarrierName;
            carrier.ValidDate = dto.ValidDate;
            carrier.Status = dto.Status;
            carrier.Remarks = dto.Remarks;
            carrier.SetAudit(dto, isCreate, true);

            return carrier;
        }

        public static async Task<Carrier> DeleteAsync(this DbSet<Carrier> dbSet, Guid id, IUserProfile profile)
        {
            var carrier = await dbSet.ValidatePermissionAsync(id);
            bool isDeleted = carrier != null;
            if (isDeleted)
                carrier.LogicDelete(profile.UserId, profile.UserName, true);

            return carrier;
        }
    }
}
