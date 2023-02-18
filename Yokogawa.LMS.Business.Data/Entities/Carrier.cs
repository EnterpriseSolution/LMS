using System;
using System.Collections.Generic;
using Yokogawa.Data.Infrastructure.Entities;

namespace Yokogawa.LMS.Business.Data.Entities
{
    public class Carrier : SoftDeleteAuditableEntity<Guid>
    {
        public Carrier()
        {
            Vessels = new HashSet<Vessel>();
            Drivers = new HashSet<Driver>();
            Trucks = new HashSet<Truck>();
        }
        public string CarrierCode { get; set; }
        public string CarrierName { get; set; }
        public string Address { get; set; }
        public DateTime ValidDate { get; set; }
        /// <summary>
        /// Enum:Valid or Invalid
        /// </summary>
        public bool Status { get; set; }
        public string Remarks { get; set; }
        public  ICollection<Vessel> Vessels { get; set; }

        public ICollection<Driver> Drivers { get; set; }

        public ICollection<Truck> Trucks { get; set; }
    }
}
