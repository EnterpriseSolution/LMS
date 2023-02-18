using System;
using System.Linq.Expressions;
using Yokogawa.Data.Infrastructure.Extensions;
using Yokogawa.LMS.Business.Data.Entities;
using Yokogawa.LMS.Business.Service.DTOs;


namespace Yokogawa.LMS.Business.Service.Projections
{
    public class CompartmentProjection
    {
        public static Expression<Func<Compartment, CompartmentDto>> CompartmentDto
        {
            get
            {
                return (m) => new CompartmentDto()
                {
                    Id = m.Id,
                    CompartmentId = m.Id.ToString(),
                    Capacity = m.Capacity,
                    CompartmentNo = m.CompartmentNo,
                    ProductId = m.ProductId,
                    St_ProductId = m.ProductId.ToString(),
                    Remarks = m.Remarks,
                    TruckId = m.TruckId,
                    St_TruckId=m.TruckId.ToString()
                }.GetAudit<CompartmentDto>(m);
            }
        }
    }
}
