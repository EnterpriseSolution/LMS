using System;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Business.Data.Entities.PipelineOrder;

namespace Yokogawa.LMS.Business.Data.DTOs
{
    public class OdPipelineOrderDto : AuditableDto, IOdPipelineOrderDto
    {
        public Guid Id { get; set; }
        public string OrderNo { get; set; }
        public string DeliveryDate { get; set; }
        public int SourceType { get; set; }
        public int Status { get; set; }
        public string ProductId { get; set; }
        public decimal OrderQty { get; set; }
        public decimal? TransferredQty { get; set; }
        public int UOM { get; set; }
        public string Destination { get; set; }
        public string CustomerId { get; set; }
        public string Remarks { get; set; }
    }
}
