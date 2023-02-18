using System;
using System.Linq.Expressions;
using Yokogawa.Data.Infrastructure.Extensions;
using Yokogawa.LMS.Business.Data.Entities;
using Yokogawa.LMS.Business.Service.DTOs;

namespace Yokogawa.LMS.Business.Service.Projections
{
    public class JettyProjection
    {
        public static Expression<Func<Jetty, JettyDto>> JettyDto
        {
            get
            {
                return (m) => new JettyDto()
                {
                    Id = m.Id,
                    JettyId = m.Id.ToString(),
                    JettyNo = m.JettyNo,
                    LOA = m.LOA,
                    Displacement = m.Displacement,
                    MaxDraft = m.MaxDraft,
                    ManifoldHeight = m.ManifoldHeight,
                    CommissionDate = m.CommissionDate,
                    Status = m.Status,
                    Remarks = m.Remarks
                }.GetAudit<JettyDto>(m);
            }
        }
    }
}
