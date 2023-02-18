using System;
using Yokogawa.Data.Infrastructure.Entities;

namespace Yokogawa.LMS.Business.Data.Entities
{
    public class Agent : SoftDeleteAuditableEntity<Guid>
    {
        public string AgentName { get; set; }
        public string AgentCode { get; set; }
        public string AgentCRNo { get; set; }
        public string Address { get; set; }
        public string Country { get; set; }
        public string PersonInCharge { get; set; }
        public string Mobile { get; set; }
        public string PhoneO { get; set; }
        public string BillingAddress { get; set; }
        public string BillingCountry { get; set; }
        public string BillTelephone { get; set; }
        /// <summary>
        /// Enum:Valid or Invalid
        /// </summary>
        public bool Status { get; set; }
        public string Remarks { get; set; }
    }
}
