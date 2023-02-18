using System;
using Yokogawa.Data.Infrastructure.Entities;

namespace Yokogawa.LMS.Business.Data.Entities
{
    public class Tank : SoftDeleteAuditableEntity<Guid>
    {
        public string TankNo { get; set; }
        public Guid? ProductId { get; set; }
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
        public decimal? RoofWeight  { get; set; }
        public decimal? FloatingRoofCorrectionLevel { get; set; }
        /// <summary>
        /// Enum:Valid or Invalid
        /// </summary>
        public bool Status { get; set; }
        public string Remarks { get; set; }
        public  Product Product { get; set; }
    }

}
