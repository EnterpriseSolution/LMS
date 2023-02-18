using System;
using System.Linq.Expressions;
using Yokogawa.Data.Infrastructure.Extensions;
using Yokogawa.Data.Infrastructure.Utils;
using Yokogawa.LMS.Business.Data.Entities;
using Yokogawa.LMS.Business.Service.DTOs;

namespace Yokogawa.LMS.Business.Service.Projections
{
    public class RFIDCardProjection
    {
        public static Expression<Func<RFIDCard, RFIDCardDto>> RFIDCardDto
        {
            get
            {
                return (m) => new RFIDCardDto()
                {
                    Id = m.Id,
                    CardId = m.Id.ToString(),
                    CardNo = m.CardNo,
                    CardType = m.CardType,
                    ValidDate = m.ValidDate.ToIso8601String(),
                    Status = m.Status,
                    Remarks = m.Remarks
                }.GetAudit<RFIDCardDto>(m);
            }
        }
    }
}
