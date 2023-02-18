using System;
using System.Linq.Expressions;
using Yokogawa.Data.Infrastructure.Extensions;
using Yokogawa.Data.Infrastructure.Utils;
using Yokogawa.LMS.Business.Data.Entities;
using Yokogawa.LMS.Business.Data.Entities.TruckLoading;
using Yokogawa.LMS.Business.Data.Entities.TruckUnloading;
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.LMS.Business.Service.DTOs.TruckLoading;
using Yokogawa.LMS.Business.Service.DTOs.TruckUnloading;

namespace Yokogawa.LMS.Business.Service.Projections
{
    public class VesselDischargeOrderProjection
    {
        public static Expression<Func<OdVesselDischargeOrder, VesselDischargeOrderDto>> VesselDischargeOrderDto
        {
            get
            {
                return (m) => new VesselDischargeOrderDto()
                {
                    Id = m.Id,
                    OrderNo = m.OrderNo,
                    ShipmentNo = m.ShipmentNo,
                    VesselId = m.VesselId,
                    OperationType = m.OperationType,
                    ETA = m.ETA,
                    SourceType = m.SourceType,
                    ProductId = m.ProductId.ToString(),
                    JettyId = m.JettyId.HasValue ? m.JettyId.ToString() : string.Empty,                    
                    OrderQty = m.OrderQty,
                    LoadedQty = m.LoadedQty,
                    UOM = m.UOM,
                    CustomerId = m.CustomerId.HasValue ? m.CustomerId.ToString() : string.Empty,                    
                    Status = m.Status,
                    Remarks = m.Remarks,
                    CreatedBy = m.CreatedBy,
                    CreatedOn = m.CreatedOn,
                    LastModifiedBy = m.UpdatedBy,
                    LastModifiedOn = m.UpdatedOn.HasValue? m.UpdatedOn.Value:DateTime.MinValue
                }.GetAudit<VesselDischargeOrderDto>(m);
            }
        }
    }
}
