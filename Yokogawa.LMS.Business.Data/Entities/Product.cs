using System;
using System.Collections.Generic;
using Yokogawa.Data.Infrastructure.Entities;

namespace Yokogawa.LMS.Business.Data.Entities
{
    public class Product : SoftDeleteAuditableEntity<Guid>
    {

        public Product()
        {
            Compartments = new HashSet<Compartment>();
            Tanks = new HashSet<Tank>();
        }
        public string ProductName { get; set; }
        public string HSCode { get; set; }
        /// <summary>
        /// Enum:Black Product or White Product?
        /// </summary>
        public int ProductGroup { get; set; }
        public decimal AvgVCF { get; set; }
        public decimal AvgRefDensity { get; set; }
        /// <summary>
        /// Enum:Valid or Invalid
        /// </summary>
        public bool Status { get; set; }
        public string Remarks { get; set; }
        public  ICollection<Compartment> Compartments { get; set; }
        public  ICollection<Tank> Tanks { get; set; }

    }
}
