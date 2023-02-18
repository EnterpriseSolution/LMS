using System;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.LMS.Business.Data.DTOs
{
    public interface ICarrierDto : IDto<Guid>, IAuditableDto
    {
        string CarrierId { get; set; }
        string CarrierCode { get; set; }
        string CarrierName { get; set; }
        string Address { get; set; }
        public DateTime ValidDate { get; set; }
        /// <summary>
        /// Enum:Valid or Invalid
        /// </summary>
        bool Status { get; set; }
        string Remarks { get; set; }
    }
}
