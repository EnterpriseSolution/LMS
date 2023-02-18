using System;
using System.Collections.Generic;
using Yokogawa.Data.Infrastructure.Entities;
namespace Yokogawa.LMS.Business.Data.Entities
{
    public class Truck : SoftDeleteAuditableEntity<Guid>
    {

        public Truck()
        {
            Compartments = new HashSet<Compartment>();
        }
        public string TruckCode { get; set; }
        public string Maker { get; set; }
        public DateTime? YearBuilt { get; set; }
        public decimal? RegisteredTareWeight { get; set; }
        public decimal? RegisteredGrossWeight { get; set; }
        public DateTime? LastInspectionDate { get; set; }
        public DateTime? InspectionDueDate { get; set; }
        public DateTime? ValidDate { get; set; }
        public Guid? CarrierId { get; set; }
        public bool Status { get; set; }
        public string Remarks { get; set; }
        public Carrier Carrier { get; set; }
        public ICollection<Compartment> Compartments { get; set; }


    }
}
