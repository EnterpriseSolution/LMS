using System;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.LMS.Business.Data.DTOs
{
    public interface IAgentDto : IDto<Guid>, IAuditableDto
    {
        string AgentId { get; set; }
        string AgentName { get; set; }
        string AgentCode { get; set; }
        string AgentCRNo { get; set; }
        string Address { get; set; }
        string Country { get; set; }
        string PersonInCharge { get; set; }
        string Mobile { get; set; }
        string PhoneO { get; set; }
        string BillingAddress { get; set; }
        string BillingCountry { get; set; }
        string BillTelephone { get; set; }
        /// <summary>
        /// Enum:Valid or Invalid
        /// </summary>
        bool Status { get; set; }
        string Remarks { get; set; }
    }
}
