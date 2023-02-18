using System;
using Yokogawa.Data.Infrastructure.Entities;

namespace Yokogawa.LMS.Business.Data.Entities
{
    public class Jetty : SoftDeleteAuditableEntity<Guid>
    {
        public string JettyNo { get; set; }
        public decimal LOA { get; set; }
        public decimal Displacement { get; set; }
        public decimal MaxDraft { get; set; }
        public decimal ManifoldHeight { get; set; }
        public DateTime CommissionDate { get; set; }
        public Boolean Status { get; set; }
        public string Remarks { get; set; }
    }
}
