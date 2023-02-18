using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Yokogawa.Data.Infrastructure.Extensions;
using Yokogawa.LMS.Business.Data.Entities;
using Yokogawa.LMS.Business.Data.Entities.TruckLoading;
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.LMS.Business.Service.DTOs.TruckLoading;

namespace Yokogawa.LMS.Business.Service.Projections.TruckLoading
{ 
    public class OdTruckLoadingOrderProjection
    {
        public static Expression<Func<OdTruckLoadingOrder, OdTruckLoadingOrderDto>> OdTruckLoadingOrderListDto
        {
            get
            {
                return (m) => new OdTruckLoadingOrderDto()
                {
                    Id = m.Id,
                    OdTruckLoadingOrderId = m.Id.ToString(),
                    OrderNo = m.OrderNo,
                    DeliveryDate = m.DeliveryDate,
                    SourceType = m.SourceType,
                    Status = m.Status,
                    TruckId = m.TruckId,
                    FrontLicense = m.FrontLicense,
                    RearLicense = m.RearLicense,
                    BayNo = m.BayNo,
                    Remarks = m.Remarks

                }.GetAudit<OdTruckLoadingOrderDto>(m);
            }
        }

        public static Expression<Func<OdTruckLoadingOrder, OdTruckLoadingOrderDto>> OdTruckLoadingOrderDto
        {
            get
            {
                return (m) => new OdTruckLoadingOrderDto()
                {
                    Id = m.Id,
                    OdTruckLoadingOrderId = m.Id.ToString(),
                    OrderNo = m.OrderNo,
                    DeliveryDate = m.DeliveryDate,
                    SourceType = VerifyCode(m.SourceType),
                    Status = VerifyCode(m.Status),
                    TruckId = m.TruckId,
                    FrontLicense = m.FrontLicense,
                    RearLicense = m.RearLicense,
                    BayNo = m.BayNo,
                    Remarks = m.Remarks,
                    St_CarrierId = m.CarrierId.ToString(),
                    St_CardId = m.CardId.ToString(),
                    St_DriverId = m.DriverId.ToString(),
                    St_TruckId = m.TruckId.ToString(),
                    OdTruckLoadingJobDtos= ConvertToOdTruckLoadingJobDtos(m.OdTruckLoadingJobs)
                }.GetAudit<OdTruckLoadingOrderDto>(m);
            }

        }


        public static List<OdTruckLoadingJobDto>ConvertToOdTruckLoadingJobDtos(ICollection<OdTruckLoadingJob> OdTruckLoadingJobs)
        {
            OdTruckLoadingJobs = OdTruckLoadingJobs ?? new List<OdTruckLoadingJob>();
            var result = OdTruckLoadingJobs.Select<OdTruckLoadingJob, OdTruckLoadingJobDto>(m => new OdTruckLoadingJobDto()
            {
                Id = m.Id,
                Destination = m.Destination,
                JobNo = m.JobNo,
                LoadedQty = m.LoadedQty,
                OrderQty = m.OrderQty,
                Remarks = m.Remarks,
                SealNo = m.SealNo,
                Status = m.Status,
                Uom = m.Uom,
                CompartmentNo = m.Compartment?.CompartmentNo ?? null,
                CustomerName = m.Customer?.CustomerName ?? null,
                ProductName = m.Product?.ProductName ?? null,
                St_CompartmentId = m.CompartmentId == Guid.Empty?null: m.CompartmentId.ToString(),
                St_CustomerId= m.CustomerId == Guid.Empty ? null : m.CustomerId.ToString(),
                St_ProductId = m.ProductId == Guid.Empty ? null : m.ProductId.ToString(),
                St_TankId = m.TankId == Guid.Empty ? null : m.TankId.ToString(),
                OrderId = m.OrderId
            }.GetAudit<OdTruckLoadingJobDto>(m)).ToList();
            return result;
        }

        public static int? VerifyCode(int param)
        {
            int? status = 0;
            if (param == 0)
            {
                status = null;
            }
            else
            {
                status = param;
            }
            return status;


        }
    }
}
