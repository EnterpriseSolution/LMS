using System;
using System.Collections.Generic;
using Yokogawa.Data.Infrastructure.Entities;

namespace Yokogawa.LMS.Business.Data.Entities
{
    public class RFIDCard : SoftDeleteAuditableEntity<Guid>
    {
        public RFIDCard()
        {
             Drivers = new HashSet<Driver>();
        }
        public string CardNo { get; set; }
        /// <summary>
        /// Enum:Permanent or Temporary 
        /// </summary>
        public int CardType { get; set; }
        public DateTime ValidDate { get; set; }
        /// <summary>
        /// Enum:Valid or Invalid
        /// </summary>
        public bool Status { get; set; }
        public string Remarks { get; set; }

        public ICollection<Driver> Drivers { get; set; }
    }
}
