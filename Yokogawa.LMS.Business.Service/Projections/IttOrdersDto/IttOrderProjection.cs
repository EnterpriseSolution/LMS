using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using Yokogawa.Data.Infrastructure.Extensions;
using Yokogawa.LMS.Business.Data.Entities;
using Yokogawa.LMS.Business.Data.Entities.IttOrder;
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.LMS.Business.Service.DTOs.IttOrder;

namespace Yokogawa.LMS.Business.Service.Projections.IttOrderDtos
{
    public class IttOrderProjection
    {
        public static Expression<Func<OdIttOrder, IttOrderDto>> IttOrderDtoList
        {
            get
            {
                return (m) => new IttOrderDto()
                {
                    OrderNo = m.OrderNo,
                    FromCustomerId = m.FromCustomerId,
                    St_FromCustomerId = m.FromCustomerId.ToString(),
                    FromCustomerName=m.FromCustomer.CustomerName,
                    FromTankId = m.FromTankId,
                    St_FromTankId = m.FromTankId.ToString(),
                    FromTankNo=m.FromTank.TankNo,
                    ToCustomerId = m.ToCustomerId,
                    St_ToCustomerId = m.ToCustomerId.ToString(),
                    ToCustomerName=m.ToCustomer.CustomerName,
                    ToTankId = m.ToTankId,
                    St_ToTankId = m.ToTankId.ToString(),
                    ToTankNo = m.ToTank.TankNo,
                    FinalProductId = m.FinalProductId,
                    St_FinalProductId = m.FinalProductId.ToString(),
                    FinalProductName=m.FinalProduct.ProductName,
                    DeliveryDate = m.DeliveryDate,
                    SourceType = m.SourceType,
                    Status = m.Status,
                    OrderQty = m.OrderQty,
                    TransferredQty = m.TransferredQty,
                    Uom = m.Uom,
                    Remarks = m.Remarks,
                    Id = m.Id

                }.GetAudit<IttOrderDto>(m);



            }
        }

        public static Expression<Func<OdIttOrder, IttOrderDto>> IttOrderDto
        {
            get
            {
                return (m) => new

                 IttOrderDto()
                {
                    OrderNo = m.OrderNo,
                    FromCustomerId = m.FromCustomerId,
                    St_FromCustomerId = m.FromCustomerId.ToString(),
                    FromTankId = m.FromTankId,
                    St_FromTankId = m.FromTankId.ToString(),
                    ToCustomerId = m.ToCustomerId,
                    St_ToCustomerId = m.ToCustomerId.ToString(),
                    ToTankId = m.ToTankId,
                    St_ToTankId = m.ToTankId.ToString(),
                    FinalProductId = m.FinalProductId,
                    St_FinalProductId = m.FinalProductId.ToString(),
                    DeliveryDate = m.DeliveryDate,
                    SourceType = m.SourceType,
                    Status = m.Status,
                    OrderQty = m.OrderQty,
                    TransferredQty = m.TransferredQty,
                    Uom = m.Uom,
                    Remarks = m.Remarks,
                    Id = m.Id
                  // CreatedBy= m.FromCustomer.Select

                }.GetAudit<IttOrderDto>(m);



            }
        }


        //public static CustomerDto ConvertToCustomerDto(Customer customer)
        //{
        //    var result = customer.
        //    return result;
        //}
    }
}
