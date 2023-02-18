using System;
using System.Linq.Expressions;
using Yokogawa.Data.Infrastructure.Extensions;
using Yokogawa.LMS.Business.Data.Entities;
using Yokogawa.LMS.Business.Data.Entities.TruckLoading;
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.LMS.Business.Service.DTOs.TruckLoading;

namespace Yokogawa.LMS.Business.Service.Projections.TruckLoading
{
    public class OdTruckLoadingJobProjection
    {
        public static Expression<Func<OdTruckLoadingJob, OdTruckLoadingJobDto>> OdTruckLoadingJobDto
        {
            get
            {
                return (m) => new OdTruckLoadingJobDto()
                {
                    Id = m.Id,
                    OrderId = m.OrderId,
                    JobNo = m.JobNo,
                    CompartmentId = m.CompartmentId,
                    ProductId = m.ProductId,
                    TankId = m.TankId,
                    SealNo = m.SealNo,
                    Destination = m.Destination,
                    CustomerId = m.CustomerId,
                    OrderQty = m.OrderQty,
                    LoadedQty = m.LoadedQty,
                    Uom = m.Uom,
                    Status = VerifyStatusCode(m.Status),
                    Remarks = m.Remarks
                }.GetAudit<OdTruckLoadingJobDto>(m);
            }

        }

        public static int? VerifyStatusCode(int param) {
            int? status = 0;
            if (param == 0)
            {
                status = null;
            }
            else {
                status = param;
            }
            return status;


        }





    }
}
