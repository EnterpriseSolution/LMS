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
    public static class DriverCommands
    {
        public static async Task<Driver> ValidatePermissionAsync(this DbSet<Driver> dbSet, Guid id)
        {
            Driver entity = await dbSet.GetById(id).FirstOrDefaultAsync();

            return entity;
        }

        public static async Task ValidateAsync(this DbSet<Driver> dbSet, IDriverDto dto)
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

        public static async Task<Driver> CreateOrUpdateAsync(this DbSet<Driver> dbSet, IDriverDto dto, IUserProfile profile)
        {
            dto.SetAudit(profile.UserId, profile.UserName);
            var driver = await dbSet.ValidatePermissionAsync(dto.Id);
            bool isCreate = driver == null;

            if (isCreate)
            {
                driver = new Driver();
                driver.Id = Guid.NewGuid();
                dbSet.Add(driver);
            }
            await dbSet.ValidateAsync(dto);

            driver.DriverCode = dto.DriverCode;
            driver.DriverName = dto.DriverName;
            driver.License = dto.License;
            driver.PIN = dto.PIN;
            driver.Gender = dto.Gender;
            driver.Age = dto.Age;
            driver.YearsExperience = dto.YearsExperience;
            driver.CardId = GenrateGuid(dto.St_CardId); ;
            driver.CarrierId = GenrateGuid(dto.St_CarrierId); 
            driver.DriverGrade = dto.DriverGrade;
            driver.ReTrainingDate = dto.ReTrainingDate;
            driver.ValidDate = dto.ValidDate;
            driver.Status = dto.Status;
            driver.Remarks = dto.Remarks;
            driver.SetAudit(dto, isCreate, true);

            return driver;
        }

        public static async Task<Driver> DeleteAsync(this DbSet<Driver> dbSet, Guid id, IUserProfile profile)
        {
            var driver = await dbSet.ValidatePermissionAsync(id);
            bool isDeleted = driver != null;
            if (isDeleted)
                driver.LogicDelete(profile.UserId, profile.UserName, true);

            return driver;
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
