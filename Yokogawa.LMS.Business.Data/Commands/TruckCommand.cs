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
    public static class TruckCommand
    {
        public static async Task<Truck> ValidatePermissionAsync(this DbSet<Truck> dbSet, Guid id)
        {
            Truck entity = await dbSet.Include(p => p.Compartments).GetById(id).FirstOrDefaultAsync();

            return entity;
        }

        public static async Task ValidateAsync(this DbSet<Truck> dbSet, ITruckDto dto)
        {
            StringBuilder sb = new StringBuilder();
            List<Guid> RestIdList= await dbSet.ExcludeDeletion().AsNoTracking().Where(o => o.Id != dto.Id && dto.Id != Guid.Empty).Select(p => p.Id).ToListAsync();
            if (dto.Id != Guid.Empty && RestIdList.Contains(dto.Id)) {
                sb.AppendLine("Duplicate Record");
            }
            

            if (sb.Length > 0)
                throw new ConflictException(sb.ToString());
        }

        public static async Task<Truck> CreateOrUpdateAsync(this DbSet<Truck> dbSet, ITruckDto dto, IEnumerable<ICompartmentDto> dtos, IUserProfile profile)
        {
            dto.SetAudit(profile.UserId, profile.UserName);
            var truck = await dbSet.ValidatePermissionAsync(dto.Id);
            bool isCreate = truck == null;

            if (isCreate)
            {
                truck = new Truck();
                truck.Id = Guid.NewGuid();
                dbSet.Add(truck);
            }
             await dbSet.ValidateAsync(dto);
            if (string.IsNullOrWhiteSpace(dto.St_CarrierId)) {
                truck.CarrierId = null;
            }
            else {
                truck.CarrierId = Guid.Parse(dto.St_CarrierId);
            }
            truck.InspectionDueDate = dto.InspectionDueDate;
            truck.LastInspectionDate = dto.LastInspectionDate;
            truck.Maker = dto.Maker;
            truck.RegisteredGrossWeight = dto.RegisteredGrossWeight;
            truck.RegisteredTareWeight = dto.RegisteredTareWeight;
            truck.Remarks = dto.Remarks;
            truck.Status = dto.Status;
            truck.TruckCode = dto.TruckCode;
            truck.ValidDate = dto.ValidDate;
            truck.YearBuilt = dto.YearBuilt;
            CreateOrUpdateCompartments(dtos, truck, profile);
            truck.SetAudit(dto, isCreate, true);

            return truck;
        }

        public static void CreateOrUpdateCompartments(IEnumerable<ICompartmentDto> dtos, Truck truck, IUserProfile profile)
        {
            List<Compartment> CompartmentList = new List<Compartment>();
           
            foreach (var dto in dtos)
            {
                dto.SetAudit(profile.UserId, profile.UserName);
                var iscreate = false;
                var Compartment = new Compartment();
                if (dto.Id == Guid.Empty)
                {
                    iscreate = true;
                    Compartment.Id = Guid.NewGuid();
                }
                else
                {
                    Compartment = truck.Compartments.Where(p => p.Id == dto.Id).FirstOrDefault();
                }

                Compartment.CompartmentNo = dto.CompartmentNo;
                Compartment.Capacity = dto.Capacity;
                Compartment.Remarks = dto.Remarks;
                Compartment.IsDeleted = dto.IsDeleted;
                Compartment.TruckId = truck.Id;
                Compartment.ProductId = Guid.Parse(dto.St_ProductId);
                dto.Id =Compartment.Id;
                Compartment.SetAudit(dto, iscreate, true);
                CompartmentList.Add(Compartment);
            }
            truck.Compartments = CompartmentList;
        }

        public static async Task<Truck> DeleteAsync(this DbSet<Truck> dbSet, Guid id, IUserProfile profile)
        {
            var Truck = await dbSet.ValidatePermissionAsync(id);
            bool isDeleted = Truck != null;
            if (isDeleted)
                Truck.LogicDelete(profile.UserId, profile.UserName, true);

            return Truck;
        }

    }
}
