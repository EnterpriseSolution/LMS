using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;

namespace Yokogawa.LMS.Business.Data.Entities.TruckLoading
{
    public class OdTruckLoadingJob : SoftDeleteAuditableEntity<Guid>
    {
        public Guid OrderId { get; set; }
        public OdTruckLoadingOrder Order { get; set; }
        public string JobNo { get; set; }
        public Guid CompartmentId { get; set; }
        public Compartment Compartment { get; set; }
        public Guid? ProductId { get; set; }
        public Product Product { get; set; }
        public Guid? TankId { get; set; }
        public Tank Tank { get; set; }
        public string SealNo { get; set; }
        public string Destination { get; set; }
        public Guid? CustomerId { get; set; }
        public Customer Customer { get; set; }
        public decimal? OrderQty { get; set; }
        public decimal? LoadedQty { get; set; }
        public int? Uom { get; set; }
        public int Status { get; set; }
        public string Remarks { get; set; }
        
    }
}
