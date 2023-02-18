using System;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Business.Data.DTOs;
using Yokogawa.LMS.Business.Data.Entities;
namespace Yokogawa.LMS.Business.Service.DTOs
{
    public class TankDto : AuditableDto, ITankDto
    {
        public Guid Id { get; set; }
        public string TankId { get; set; }
        public string TankNo { get; set; }
        public string ProductId { get; set; }
        /// <summary>
        /// Enum:Floating Tank;Blank
        /// </summary>
        public int TankType { get; set; }
        public decimal? RefHeight { get; set; }
        public decimal? MaxSafeLevel { get; set; }
        public decimal? MaxOperationVolume { get; set; }
        public decimal? CriticalZoneFrom { get; set; }
        public decimal? CriticalZoneTo { get; set; }
        public decimal? CenterDatumLimit { get; set; }
        public decimal? RoofWeight { get; set; }
        public decimal? FloatingRoofCorrectionLevel { get; set; }
        /// <summary>
        /// Enum:Valid or Invalid
        /// </summary>
        public bool Status { get; set; }
        public string Remarks { get; set; }  

        public bool AllowEdit { get; set; }

        public string StatusDescription { get; set; }

        public string TankTypeDescription { get; set; }
    }
}
