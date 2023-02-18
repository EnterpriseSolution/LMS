using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;

namespace Yokogawa.LMS.Business.Data.Entities.IttOrder
{
    public partial  class OdIttOrder : SoftDeleteAuditableEntity<Guid>
    {
        public string OrderNo { get; set; }
        public Guid FromCustomerId { get; set; }
        public Customer FromCustomer { get; set; }
        public Guid ToCustomerId { get; set; }
        public Customer ToCustomer { get; set; }
        public Guid FromTankId { get; set; }
        public Tank FromTank { get; set; }
        public Guid ToTankId { get; set; }
        public Tank ToTank { get; set; }

        public Guid FinalProductId { get; set; }
        public  Product FinalProduct { get; set; }

        public DateTime DeliveryDate { get; set; }
       
        public int SourceType { get; set; }
        public int Status { get; set; }
        public decimal OrderQty { get; set; }
        public decimal? TransferredQty { get; set; }
        public int Uom { get; set; }
        public string Remarks { get; set; }
      
    }
}
