using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.DTOs.Base;
namespace Yokogawa.LMS.Business.Data.DTOs.TruckLoading
{
    public interface IOdTruckLoadingJobDto : IDto<Guid>, IAuditableDto
    {
        Guid OrderId { get; set; }
        string JobNo { get; set; }
        Guid CompartmentId { get; set; }
        String St_CompartmentId { get; set; }
        Guid? ProductId { get; set; }
        String St_ProductId { get; set; }
        Guid? TankId { get; set; }
        String St_TankId { get; set; }
        string SealNo { get; set; }
        string Destination { get; set; }
        Guid? CustomerId { get; set; }
        decimal? OrderQty { get; set; }
        decimal? LoadedQty { get; set; }
        int? Uom { get; set; }
        int? Status { get; set; }
        string Remarks { get; set; }
    }
}
