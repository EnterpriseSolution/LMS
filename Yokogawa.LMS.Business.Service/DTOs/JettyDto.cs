using System;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Business.Data.DTOs;

namespace Yokogawa.LMS.Business.Service.DTOs
{
    public class JettyDto : AuditableDto, IJettyDto
    {
        public Guid Id { get; set; }
        public string JettyId { get; set; }
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
