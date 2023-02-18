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
    public static class OdTruckLoadingOrderCommand
    {
        public static async Task<OdTruckLoadingOrder> ValidatePermissionAsync(this DbSet<OdTruckLoadingOrder> dbSet, Guid id)
        {
            OdTruckLoadingOrder entity = await dbSet.Include(p => p.OdTruckLoadingJobs).GetById(id).FirstOrDefaultAsync();

            return entity;
        }

        public static async Task ValidateAsync(this DbSet<OdTruckLoadingOrder> dbSet, IOdTruckLoadingOrderDto dto)
        {
            StringBuilder sb = new StringBuilder();
            List<Guid> RestIdList = await dbSet.ExcludeDeletion().AsNoTracking().Where(o => o.Id != dto.Id && dto.Id != Guid.Empty).Select(p => p.Id).ToListAsync();

            if (dto.Id != Guid.Empty && RestIdList.Contains(dto.Id))
            {
                sb.AppendLine("Duplicate Record");
            }

            if (string.IsNullOrWhiteSpace(dto.St_TruckId))
                sb.AppendLine("Please select a Truck");
            

            if (sb.Length > 0)
                throw new ConflictException(sb.ToString());
        }

        

        public static async Task<OdTruckLoadingOrder> CreateOrUpdateAsync(this DbSet<OdTruckLoadingOrder> dbSet, IOdTruckLoadingOrderDto orderDto, IEnumerable<IOdTruckLoadingJobDto> jobDtos, IUserProfile profile)
        {
            orderDto.SetAudit(profile.UserId, profile.UserName);
            var OdTruckLoadingOrder = await dbSet.ValidatePermissionAsync(orderDto.Id);
            bool isCreate = OdTruckLoadingOrder == null;

            if (isCreate)
            {
                OdTruckLoadingOrder = new OdTruckLoadingOrder();
                OdTruckLoadingOrder.Id = Guid.NewGuid();
                dbSet.Add(OdTruckLoadingOrder);
            }
            await dbSet.ValidateAsync(orderDto);
            OdTruckLoadingOrder.OrderNo = orderDto.OrderNo;
            OdTruckLoadingOrder.DeliveryDate = orderDto.DeliveryDate;
            OdTruckLoadingOrder.SourceType = orderDto.SourceType??0;
            OdTruckLoadingOrder.Status = orderDto.Status??0;
            OdTruckLoadingOrder.BayNo = orderDto.BayNo;
            OdTruckLoadingOrder.Remarks = orderDto.Remarks;
            OdTruckLoadingOrder.FrontLicense = orderDto.FrontLicense;
            OdTruckLoadingOrder.RearLicense = orderDto.RearLicense;
            OdTruckLoadingOrder.CardId =GenrateGuid (orderDto.St_CardId);
            OdTruckLoadingOrder.DriverId=GenrateGuid(orderDto.St_DriverId);
            OdTruckLoadingOrder.CarrierId=GenrateGuid(orderDto.St_CarrierId);
            OdTruckLoadingOrder.TruckId = Guid.Parse(orderDto.St_TruckId);
            orderDto.OdTruckLoadingOrderId = OdTruckLoadingOrder.Id.ToString();
            CreateOrUpdateOdTruckLoadingJobDtos(jobDtos, OdTruckLoadingOrder, profile);
            OdTruckLoadingOrder.SetAudit(orderDto, isCreate, true);
            return OdTruckLoadingOrder;
        }

        public static async Task<OdTruckLoadingOrder> DeleteAsync(this DbSet<OdTruckLoadingOrder> dbSet, Guid id, IUserProfile profile)
        {
            var OdTruckLoadingOrder = await dbSet.ValidatePermissionAsync(id);
            bool isDeleted = OdTruckLoadingOrder != null;
            if (isDeleted)
                OdTruckLoadingOrder.LogicDelete(profile.UserId, profile.UserName, false);

            return OdTruckLoadingOrder;
        }


        public static void CreateOrUpdateOdTruckLoadingJobDtos(IEnumerable<IOdTruckLoadingJobDto> dtos, OdTruckLoadingOrder order, IUserProfile profile)
        {
            List<OdTruckLoadingJob> OdTruckLoadingJobList = new List<OdTruckLoadingJob>();

            foreach (var dto in dtos)
            {
                dto.SetAudit(profile.UserId, profile.UserName);
                var iscreate = false;
                var OdTruckLoadingJob = new OdTruckLoadingJob();
                if (dto.Id == Guid.Empty)
                {
                    iscreate = true;
                    OdTruckLoadingJob.Id = Guid.NewGuid();
                }
                else
                {
                    OdTruckLoadingJob = order.OdTruckLoadingJobs.Where(p => p.Id == dto.Id).FirstOrDefault();
                }
                
                OdTruckLoadingJob.OrderId = order.Id;
                OdTruckLoadingJob.JobNo = dto.JobNo;
                OdTruckLoadingJob.SealNo = dto.SealNo;
                OdTruckLoadingJob.Destination = dto.Destination;
                OdTruckLoadingJob.CustomerId = dto.CustomerId;
                OdTruckLoadingJob.OrderQty = dto.OrderQty;
                OdTruckLoadingJob.LoadedQty = dto.LoadedQty;
                OdTruckLoadingJob.Uom = dto.Uom;
                OdTruckLoadingJob.Status = dto.Status??0;
                OdTruckLoadingJob.Remarks = dto.Remarks;
                OdTruckLoadingJob.CompartmentId =Guid.Parse(dto.St_CompartmentId);
                OdTruckLoadingJob.ProductId = GenrateGuid(dto.St_ProductId); 
                OdTruckLoadingJob.TankId = GenrateGuid(dto.St_TankId);
                dto.Id = OdTruckLoadingJob.Id;
                OdTruckLoadingJob.SetAudit(dto, iscreate, true);
                OdTruckLoadingJobList.Add(OdTruckLoadingJob);
            }
            order.OdTruckLoadingJobs = OdTruckLoadingJobList;
        }


            public static Guid? GenrateGuid(String St_Id) {
            Guid? id = null;
            if (string.IsNullOrWhiteSpace(St_Id))
            {
                id = null;
            }
            else {
                id = Guid.Parse(St_Id);
            }
            return id;
         }

       
        
    }
}
