using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;

namespace Yokogawa.LMS.Business.Data.Entities.PipelineOrder
{
    public class OdPipelineOrder : SoftDeleteAuditableEntity<Guid>
    {        
        public string OrderNo { get; set; }
        public DateTime DeliveryDate { get; set; }
        public int SourceType { get; set; }
        public int Status { get; set; }
        public Guid ProductId { get; set; }
        public decimal OrderQty { get; set; }
        public decimal? TransferredQty { get; set; }
        public int UOM { get; set; }
        public string Destination { get; set; }
        public Guid? CustomerId { get; set; }
        public string Remarks { get; set; }        
    }
}
