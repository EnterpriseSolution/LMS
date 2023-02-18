using System;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.LMS.Business.Data.DTOs
{
    public interface ICompartmentDto : IDto<Guid>, IAuditableDto
    {
        string CompartmentId { get; set; }
        string CompartmentNo { get; set; }
        decimal Capacity { get; set; }
        string Remarks { get; set; }
        bool IsDeleted { get; set; }
        Guid TruckId { get; set; }
        Guid ProductId { get; set; }
        string St_ProductId { get; set; }
        IProductDto Product { get; set; }
        ITruckDto Truck { get; set; }
    }
}
