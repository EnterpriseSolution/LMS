using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.DTOs.Base;


namespace Yokogawa.LMS.Business.Data.DTOs.VesselLoadingOrder
{
    public interface IVesselLoadingOrderDto : IDto<Guid>, IAuditableDto
    {
        string VesselLoadingOrderId { get; set; }
        string OrderNo { get; set; }
        string ShipmentNo { get; set; }
        Guid VesselId { get; set; }
        string St_VesselId { get; set; }
        int OperationType { get; set; }
        DateTime Eta { get; set; }
        int SourceType { get; set; }
        Guid ProductId { get; set; }
        string St_ProductId { get; set; }
        Guid? JettyId { get; set; }
        string St_JettyId { get; set; }
        decimal OrderQty { get; set; }
        decimal? LoadedQty { get; set; }
        int Uom { get; set; }
        string Destination { get; set; }
        Guid? CustomerId { get; set; }
        string St_CustomerId { get; set; }
        int Status { get; set; }
        string Remarks { get; set; }

    }
}
