using System;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.LMS.Business.Data.Entities.IttOrder;

namespace Yokogawa.LMS.Business.Data.Entities
{
    public class Customer : SoftDeleteAuditableEntity<Guid>
    {
        public string CustomerName { get; set; }
        public string CustomerCode { get; set; }
        public string CustomerAlias { get; set; }
        public string CustomerCRNo { get; set; }
        public string Address { get; set; }
        public string Country { get; set; }
        public string PersonInCharge { get; set; }
        public string Mobile { get; set; }
        public string PhoneO { get; set; }
        public string PhoneR { get; set; }
        public string Fax { get; set; }
        public string BillingAddress { get; set; }
        public string BillingCountry { get; set; }
        public string BillTelephone { get; set; }
        /// <summary>
        /// Enum:Valid or Invalid
        /// </summary>
        public bool Status { get; set; }
        public string Remarks { get; set; }

        //public OdIttOrder OdIttOrder { get; set; }

        //public OdIttOrder OdIttOrder2 { get; set; }
    }
}
