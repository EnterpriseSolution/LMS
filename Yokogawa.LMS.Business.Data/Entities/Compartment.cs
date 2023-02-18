using System;
using Yokogawa.Data.Infrastructure.Entities;

namespace Yokogawa.LMS.Business.Data.Entities
{
    public class Compartment : SoftDeleteAuditableEntity<Guid>
    {
       
        public string CompartmentNo { get; set; }
        public decimal Capacity { get; set; }
        public string Remarks { get; set; }

        public Guid TruckId { get; set; }
        public Guid ProductId { get; set; }

        public Product Product { get; set; }
        public Truck Truck { get; set; }
    }
}
