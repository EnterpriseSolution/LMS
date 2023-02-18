using System;
using System.Collections.Generic;
using Yokogawa.Data.Infrastructure.Entities;

namespace Yokogawa.LMS.Business.Data.Entities
{
    public class OdVesselDischargeOrder : SoftDeleteAuditableEntity<Guid>
    {
        public OdVesselDischargeOrder()
        {
         
        }     

        public string OrderNo { get; set; }

        public string ShipmentNo { get; set; }

        public Guid VesselId { get; set; }

        public int OperationType { get; set; }

        public DateTime ETA { get; set; }

        public int SourceType { get; set; }

        public Guid ProductId { get; set; }

        public Guid? JettyId { get; set; }

        public decimal OrderQty { get; set; }

        public decimal? LoadedQty { get; set; }

        public int UOM { get; set; }
 
        public Guid? CustomerId { get; set; }

        public int Status { get; set; }

        public string Remarks { get; set; }       
    }
}
