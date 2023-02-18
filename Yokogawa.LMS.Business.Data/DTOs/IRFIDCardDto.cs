using System;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.LMS.Business.Data.DTOs
{
    public interface IRFIDCardDto : IDto<Guid>, IAuditableDto
    {
        string CardId { get; set; }
        string CardNo { get; set; }
        /// <summary>
        /// Enum:Permanent or Temporary 
        /// </summary>
        int CardType { get; set; }
        string ValidDate { get; set; }
        /// <summary>
        /// Enum:Valid or Invalid
        /// </summary>
        bool Status { get; set; }
        string Remarks { get; set; }
    }
}
