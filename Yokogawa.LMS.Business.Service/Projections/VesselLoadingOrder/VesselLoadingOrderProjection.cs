using System;
using System.Linq.Expressions;
using Yokogawa.Data.Infrastructure.Extensions;

using Yokogawa.LMS.Business.Data.Entities.VesselLoading;

using Yokogawa.LMS.Business.Service.DTOs.VesselLoadingOrder;

namespace Yokogawa.LMS.Business.Service.Projections.VesselLoadingOrder
{
    public class VesselLoadingOrderProjection
    {
        public static Expression<Func<OdVesselLoadingOrder, VesselLoadingOrderDto>> VesselLoadingOrderListDto
        {
            get
            {
                return (m) => new VesselLoadingOrderDto()
                {
                    Id = m.Id,
                    Destination = m.Destination,
                    Eta = m.Eta,
                    LoadedQty = m.LoadedQty,
                    OperationType = m.OperationType,
                    OrderNo = m.OrderNo,
                    OrderQty = m.OrderQty,
                    Remarks = m.Remarks,
                    ShipmentNo = m.ShipmentNo,
                    SourceType = m.SourceType,
                    Status = m.Status,
                    Uom = m.Uom,

                    CustomerId = m.CustomerId,
                    St_CustomerId = m.CustomerId.ToString(),
                    CustomerName = m.Customer==null? string.Empty: m.Customer.CustomerName,

                    JettyId = m.JettyId,
                    St_JettyId = m.JettyId.ToString(),
                    JettyNo = m.Jetty==null? string.Empty : m.Jetty.JettyNo,

                    VesselId = m.VesselId,
                    St_VesselId = m.VesselId.ToString(),
                    VesselName = m.Vessel.VesselName,

                    ProductId = m.ProductId,
                    St_ProductId = m.ProductId.ToString(),
                    ProductName = m.Product.ProductName
                }.GetAudit<VesselLoadingOrderDto>(m);
            }
        }

        public static Expression<Func<OdVesselLoadingOrder, VesselLoadingOrderDto>> VesselLoadingOrderDto
        {
            get
            {
                return (m) => new VesselLoadingOrderDto()
                {
                    Id = m.Id,
                    Destination = m.Destination,
                    Eta = m.Eta,
                    LoadedQty = m.LoadedQty,
                    OperationType = m.OperationType,
                    OrderNo = m.OrderNo,
                    OrderQty = m.OrderQty,
                    Remarks = m.Remarks,
                    ShipmentNo = m.ShipmentNo,
                    SourceType = m.SourceType,
                    Status = m.Status,
                    Uom = m.Uom,
                    CustomerId = m.CustomerId,
                    St_CustomerId = m.CustomerId.ToString(),
                    JettyId = m.JettyId,
                    St_JettyId = m.JettyId.ToString(),
                    VesselId = m.VesselId,
                    St_VesselId = m.VesselId.ToString(),
                    ProductId = m.ProductId,
                    St_ProductId = m.ProductId.ToString(),
                    
                }.GetAudit<VesselLoadingOrderDto>(m);
            }
        }
    }
}
