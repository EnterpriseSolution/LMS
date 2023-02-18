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

namespace Yokogawa.LMS.Business.Data.Commands
{
    public static class TankCommands
    {
        public static async Task<Tank> ValidatePermissionAsync(this DbSet<Tank> dbSet, Guid id)
        {
            Tank entity = await dbSet.GetById(id).FirstOrDefaultAsync();

            return entity;
        }

        public static async Task ValidateAsync(this DbSet<Tank> dbSet, ITankDto dto)
        {
            StringBuilder sb = new StringBuilder();

            bool isDuplicated = await dbSet.ExcludeDeletion().AsNoTracking().Where(o => o.Id != dto.Id && dto.Id != Guid.Empty).CountAsync() > 0;
            if (isDuplicated)
                sb.AppendLine("Duplicate Record");

            if (sb.Length > 0)
                throw new ConflictException(sb.ToString());
        }

        public static async Task<Tank> CreateOrUpdateAsync(this DbSet<Tank> dbSet, ITankDto dto, IUserProfile profile)
        {
            dto.SetAudit(profile.UserId, profile.UserName);
            var tank = await dbSet.ValidatePermissionAsync(dto.Id);
            bool isCreate = tank == null;

            if (isCreate)
            {
                tank = new Tank();
                tank.Id = Guid.NewGuid();
                dbSet.Add(tank);
            }
            //await dbSet.ValidateAsync(dto);

            tank.TankNo = dto.TankNo;
            if (!string.IsNullOrWhiteSpace(dto.ProductId))
             tank.ProductId = Guid.Parse(dto.ProductId);
            tank.TankType = dto.TankType;
            tank.RefHeight = dto.RefHeight;
            tank.MaxSafeLevel = dto.MaxSafeLevel;
            tank.MaxOperationVolume = dto.MaxOperationVolume;
            tank.CriticalZoneFrom = dto.CriticalZoneFrom;
            tank.CriticalZoneTo = dto.CriticalZoneTo;
            tank.CenterDatumLimit = dto.CenterDatumLimit;
            tank.RoofWeight = dto.RoofWeight;
            tank.FloatingRoofCorrectionLevel = dto.FloatingRoofCorrectionLevel;
            tank.Status = dto.Status;
            tank.Remarks = dto.Remarks;
            tank.SetAudit(dto, isCreate, true);

            return tank;
        }

        public static async Task<Tank> DeleteAsync(this DbSet<Tank> dbSet, Guid id, IUserProfile profile)
        {
            var tank = await dbSet.ValidatePermissionAsync(id);
            bool isDeleted = tank != null;
            if (isDeleted)
                tank.LogicDelete(profile.UserId, profile.UserName, true);

            return tank;
        }
    }
}
