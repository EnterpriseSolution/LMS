using System;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Business.Data.DTOs;

namespace Yokogawa.LMS.Business.Service.DTOs
{
    public class VesselDischargeOrderDto : AuditableDto, IVesselDischargeOrderDto
    {
        public Guid Id { get; set; }

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

        public string OperationTypeDescription { get; set; }

        public string CustomerName { get; set; }

        public string ProductName { get; set; }

        public string UOMDescription { get; set; }

        public string StatusDescription { get; set; }
    }
}
