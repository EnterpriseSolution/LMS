using System;
using System.Linq.Expressions;
using Yokogawa.Data.Infrastructure.Extensions;
using Yokogawa.Data.Infrastructure.Utils;
using Yokogawa.LMS.Business.Data.DTOs;
using Yokogawa.LMS.Business.Data.Entities.PipelineOrder;

namespace Yokogawa.LMS.Business.Service.Projections.PipelineOrder
{
    public class OdPipelineOrderProjection
    {
        public static Expression<Func<OdPipelineOrder, OdPipelineOrderDto>> OdPipelineOrderDto
        {
            get
            {
                return (m) => new OdPipelineOrderDto()
                {
                    Id = m.Id,
                    OrderNo = m.OrderNo,
                    DeliveryDate = m.DeliveryDate.ToIso8601String(),
                    SourceType = m.SourceType,
                    Status = m.Status,
                    CustomerId = m.CustomerId.ToString(),
                    ProductId = m.ProductId.ToString(),                   
                    Destination = m.Destination,
                    Remarks = m.Remarks,
                    CreatedBy = m.CreatedBy,
                    CreatedOn = m.CreatedOn,               
                    OrderQty = m.OrderQty,                   
                    UOM = m.UOM              
                }.GetAudit<OdPipelineOrderDto>(m);
            }
        }
    }
}
