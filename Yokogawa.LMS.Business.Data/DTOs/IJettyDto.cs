using System;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.LMS.Business.Data.DTOs
{
    public interface IJettyDto: IDto<Guid>, IAuditableDto
    {
        Guid Id { get; set; }
        string JettyId { get; set; }
        string JettyNo { get; set; }
        decimal LOA { get; set; }
        decimal Displacement { get; set; }
        decimal MaxDraft { get; set; }
       decimal ManifoldHeight { get; set; }
        DateTime CommissionDate { get; set; }
        Boolean Status { get; set; }
        string Remarks { get; set; }
    }
}
