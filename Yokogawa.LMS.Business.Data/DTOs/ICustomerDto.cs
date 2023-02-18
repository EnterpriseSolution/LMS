using System;
using Yokogawa.Data.Infrastructure.DTOs.Base;
namespace Yokogawa.LMS.Business.Data.DTOs
{
    public interface ICustomerDto : IDto<Guid>, IAuditableDto
    {
        string CustomerId { get; set; }
        string CustomerName { get; set; }
        string CustomerCode { get; set; }
        string CustomerAlias { get; set; }
        string CustomerCRNo { get; set; }
        string Address { get; set; }
        string Country { get; set; }
        string PersonInCharge { get; set; }
        string Mobile { get; set; }
        string PhoneO { get; set; }
        string PhoneR { get; set; }
        string Fax { get; set; }
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
