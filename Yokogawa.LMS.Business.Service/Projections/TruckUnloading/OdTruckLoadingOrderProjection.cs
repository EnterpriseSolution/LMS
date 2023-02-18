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

namespace Yokogawa.LMS.Business.Service.Projections.TruckLoading
{
    public class OdTruckUnLoadingOrderProjection
    {
        public static Expression<Func<OdTruckUnloadingOrder, OdTruckUnloadingOrderDto>> OdTruckUnLoadingOrderDto
        {
            get
            {
                return (m) => new OdTruckUnloadingOrderDto()
                {
                    Id = m.Id,
                    OrderNo = m.OrderNo,
                    UnloadingDate = m.UnloadingDate.ToIso8601String(),
                    SourceType = m.SourceType,
                    Status = m.Status,
                    CustomerId = m.CustomerId.ToString(),
                    ProductId = m.ProductId.ToString(),

                    CarrierId = m.CarrierId.HasValue?m.CarrierId.ToString():string.Empty,
                    TruckId =m.TruckId.HasValue?m.TruckId.ToString():string.Empty,
                    FrontLicense = m.FrontLicense,
                    RearLicense = m.RearLicense,
                    CardId = m.CardId.HasValue ? m.CardId.ToString() : string.Empty ,
                    DriverId = m.DriverId.HasValue ? m.DriverId.ToString() : string.Empty,
                    BayNo = m.BayNo,
                    Remarks = m.Remarks,
                    CreatedBy = m.CreatedBy,
                    CreatedOn = m.CreatedOn,                 
                    IsDeleted = m.IsDeleted,
                    OrderQty = m.OrderQty,                   
                    UnloadingQty = m.UnloadingQty,
                    UOM = m.UOM              
                }.GetAudit<OdTruckUnloadingOrderDto>(m);
            }
        }
    }
}
