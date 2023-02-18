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
    public static class CompartmentCommands
    {
        public static async Task<Compartment> ValidatePermissionAsync(this DbSet<Compartment> dbSet, Guid id)
        {
            Compartment entity = await dbSet.GetById(id).FirstOrDefaultAsync();

            return entity;
        }

        public static async Task ValidateAsync(this DbSet<Compartment> dbSet, ICompartmentDto dto)
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

        public static async Task<Compartment> CreateOrUpdateAsync(this DbSet<Compartment> dbSet, ICompartmentDto dto, IUserProfile profile)
        {
            dto.SetAudit(profile.UserId, profile.UserName);
            var Compartment = await dbSet.ValidatePermissionAsync(dto.Id);
            bool isCreate = Compartment == null;

            if (isCreate)
            {
                Compartment = new Compartment();
                Compartment.Id = Guid.NewGuid();
                dbSet.Add(Compartment);
            }
            await dbSet.ValidateAsync(dto);


            Compartment.CompartmentNo = dto.CompartmentNo;
            Compartment.Capacity = dto.Capacity;
            Compartment.Remarks = dto.Remarks;
            Compartment.IsDeleted = dto.IsDeleted;
            Compartment.TruckId = dto.TruckId;
            Compartment.ProductId = dto.ProductId;
            Compartment.SetAudit(dto, isCreate, true);
            return Compartment;
        }

        public static async Task<Compartment> DeleteAsync(this DbSet<Compartment> dbSet, Guid id, IUserProfile profile)
        {
            var Compartment = await dbSet.ValidatePermissionAsync(id);
            bool isDeleted = Compartment != null;
            if (isDeleted)
                Compartment.LogicDelete(profile.UserId, profile.UserName, true);

            return Compartment;
        }

    }
}
