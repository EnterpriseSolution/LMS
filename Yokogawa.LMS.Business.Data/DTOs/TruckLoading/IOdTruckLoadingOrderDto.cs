using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.LMS.Business.Data.DTOs.TruckLoading
{
    public interface IOdTruckLoadingOrderDto : IDto<Guid>, IAuditableDto
    {
        String OrderNo { get; set; }
         String OdTruckLoadingOrderId { get; set; }
        DateTime DeliveryDate { get; set; }
         int? SourceType { get; set; }
         int? Status { get; set; }
         Guid? CarrierId { get; set; }
         String St_CarrierId { get; set; }
         Guid TruckId { get; set; }
         String St_TruckId { get; set; }
        String FrontLicense { get; set; }
        String RearLicense { get; set; }
         Guid? CardId { get; set; }
        String St_CardId { get; set; }
        Guid? DriverId { get; set; }
        String St_DriverId { get; set; }
        String BayNo { get; set; }
        String Remarks { get; set; }

    }
}
