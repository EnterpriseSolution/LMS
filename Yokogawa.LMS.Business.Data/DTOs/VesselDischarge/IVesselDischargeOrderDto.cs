using System;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.LMS.Business.Data.DTOs
{
    public interface IVesselDischargeOrderDto : IDto<Guid>, IAuditableDto
    {
        public string OrderNo { get; set; }
        public string ShipmentNo { get; set; }
        public Guid VesselId { get; set; }
        public int OperationType { get; set; }
        public DateTime ETA { get; set; }
        public int SourceType { get; set; }
        public string ProductId { get; set; }
        public string JettyId { get; set; }
        public decimal OrderQty { get; set; }
        public decimal? LoadedQty { get; set; }
        public int UOM { get; set; }               
        public string CustomerId { get; set; }
        public int Status { get; set; }
        public string Remarks { get; set; }
    }
}
