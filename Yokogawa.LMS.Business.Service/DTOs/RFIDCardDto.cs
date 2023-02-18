using System;
using System.Collections.Generic;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Business.Data.DTOs;

namespace Yokogawa.LMS.Business.Service.DTOs
{
    public class RFIDCardDto : AuditableDto, IRFIDCardDto
    {
        public Guid Id { get; set; }
        public string CardId { get; set; }
        public string CardNo { get; set; }
        /// <summary>
        /// Enum:Permanent or Temporary 
        /// </summary>
        public int CardType { get; set; }
        public string ValidDate { get; set; }
        /// <summary>
        /// Enum:Valid or Invalid
        /// </summary>
        public bool Status { get; set; }
        public string Remarks { get; set; }
        public List<DriverDto> Drivers { get; set; } = new List<DriverDto>();

        public string CardTypeDescription { get; set; }
        public string StatusDescription { get; set; }
        public bool AllowEdit { get; set; }        
    }
}
