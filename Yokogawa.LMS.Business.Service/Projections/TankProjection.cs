using System;
using System.Linq.Expressions;
using Yokogawa.Data.Infrastructure.Extensions;
using Yokogawa.LMS.Business.Data.Entities;
using Yokogawa.LMS.Business.Data.Enums;
using Yokogawa.LMS.Business.Service.DTOs;

namespace Yokogawa.LMS.Business.Service.Projections
{
    public class TankProjection
    {
        public static Expression<Func<Tank, TankDto>> TankDto
        {
            get
            {
                return (m) => new TankDto()
                {
                    Id = m.Id,
                    TankId = m.Id.ToString(),
                    TankNo = m.TankNo,
                    ProductId = m.ProductId.ToString(),
                    TankType = m.TankType,
                    RefHeight = m.RefHeight,
                    MaxSafeLevel = m.MaxSafeLevel,
                    MaxOperationVolume = m.MaxOperationVolume,
                    CriticalZoneFrom = m.CriticalZoneFrom,
                    CriticalZoneTo = m.CriticalZoneTo,
                    CenterDatumLimit = m.CenterDatumLimit,
                    RoofWeight = m.RoofWeight,
                    FloatingRoofCorrectionLevel = m.FloatingRoofCorrectionLevel,
                    Status = m.Status,
                    Remarks = m.Remarks
                }.GetAudit<TankDto>(m);
            }
        }
    }
}
