using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;

namespace Yokogawa.LMS.Business.Data.Entities.VesselLoading
{
   public partial class OdVesselLoadingOrder : SoftDeleteAuditableEntity<Guid>
    {
       
        public string OrderNo { get; set; }
        public string ShipmentNo { get; set; }
        public Guid VesselId { get; set; }
        public Vessel Vessel { get; set; }
        public int OperationType { get; set; }
        public DateTime Eta { get; set; }
        public int SourceType { get; set; } 
        public Guid ProductId { get; set; }
        public Product Product { get; set; }
        public Guid? JettyId { get; set; }
        public Jetty Jetty { get; set; }
        public decimal OrderQty { get; set; }
        public decimal? LoadedQty { get; set; }
        public int Uom { get; set; }
        public string Destination { get; set; }
        public Guid? CustomerId { get; set; }
        public Customer Customer { get; set; }
        public int Status { get; set; }
        public string Remarks { get; set; }
       
       
    }
}
