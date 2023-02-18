using System;
using System.Collections.Generic;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Business.Data.DTOs;
using Yokogawa.LMS.Business.Data.DTOs.TruckLoading;

namespace Yokogawa.LMS.Business.Service.DTOs.TruckLoading
{
    public class OdTruckLoadingOrderDto : AuditableDto, IOdTruckLoadingOrderDto
    {
        public Guid Id { get; set; }
        public String OdTruckLoadingOrderId { get; set; }

        public string OrderNo { get; set; }
        public DateTime DeliveryDate { get; set; }
        public int? SourceType { get; set; }
        public int? Status { get; set; }
        public string BayNo { get; set; }
        public string Remarks { get; set; }
        public string FrontLicense { get; set; }
        public string RearLicense { get; set; }
        public Guid? CardId { get; set; }
        public String St_CardId { get; set; }
        public Guid? DriverId { get; set; }
        public String St_DriverId { get; set; }
        public String DriverName { get; set; }
        public Guid? CarrierId { get; set; }
        public String St_CarrierId { get; set; }
        public String CarrierName { get; set; }
        public Guid TruckId { get; set; }
        public String St_TruckId { get; set; }
        public String TruckName { get; set; }
        public List<OdTruckLoadingJobDto> OdTruckLoadingJobDtos { get; set; } = new List<OdTruckLoadingJobDto>();

    }
}
