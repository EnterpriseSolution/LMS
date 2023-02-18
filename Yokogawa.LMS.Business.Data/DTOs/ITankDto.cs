using System;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Business.Data.Entities;

namespace Yokogawa.LMS.Business.Data.DTOs
{
    public interface ITankDto : IDto<Guid>, IAuditableDto
    {
        //string TankId { get; set; }
        string TankNo { get; set; }
        string ProductId { get; set; }
        /// <summary>
        /// Enum:Floating Tank;Blank
        /// </summary>
        int TankType { get; set; }
        decimal? RefHeight { get; set; }
        decimal? MaxSafeLevel { get; set; }
        decimal? MaxOperationVolume { get; set; }
        decimal? CriticalZoneFrom { get; set; }
        decimal? CriticalZoneTo { get; set; }
        decimal? CenterDatumLimit { get; set; }
        decimal? RoofWeight { get; set; }
        decimal? FloatingRoofCorrectionLevel { get; set; }
        /// <summary>
        /// Enum:Valid or Invalid
        /// </summary>
        bool Status { get; set; }
        string Remarks { get; set; }
        
    }
}
