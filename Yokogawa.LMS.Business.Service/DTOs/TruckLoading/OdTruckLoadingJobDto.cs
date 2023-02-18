using System;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Business.Data.DTOs;
using Yokogawa.LMS.Business.Data.DTOs.TruckLoading;

namespace Yokogawa.LMS.Business.Service.DTOs.TruckLoading
{
    public class OdTruckLoadingJobDto : AuditableDto, IOdTruckLoadingJobDto
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }
        public string JobNo { get; set; }
        public Guid CompartmentId { get; set; }
        public String St_CompartmentId { get; set; }
        public String CompartmentNo { get; set; }
        public Guid? ProductId { get; set; }
        public String St_ProductId { get; set; }
        public String ProductName { get; set; }
        public Guid? TankId { get; set; }
        public String St_TankId { get; set; }
        public string SealNo { get; set; }
        public string Destination { get; set; }
        public Guid? CustomerId { get; set; }
        public String St_CustomerId { get; set; }
        public string CustomerName { get; set; }
        public decimal? OrderQty { get; set; }
        public decimal? LoadedQty { get; set; }
        public int? Uom { get; set; }
        public int? Status { get; set; }
        public string Remarks { get; set; }
       
    }
}
