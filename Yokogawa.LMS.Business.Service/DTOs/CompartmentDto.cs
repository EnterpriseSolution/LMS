using System;
using System.Collections.Generic;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Business.Data.DTOs;

namespace Yokogawa.LMS.Business.Service.DTOs
{
    public class CompartmentDto : AuditableDto, ICompartmentDto
    {
      
        public Guid Id { get; set; }
        public string CompartmentId { get; set; }
        public string CompartmentNo { get; set; }
        public decimal Capacity { get; set; }
        public string Remarks { get; set; }
        public bool IsDeleted { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public Guid TruckId { get; set; }
        public string St_TruckId { get; set; }
        public Guid ProductId { get; set; }
        public string St_ProductId { get; set; }
        public IProductDto Product { get; set; }
        public string ProductName { get; set; }

        public ITruckDto Truck { get; set; }

        public string TruckName { get; set; }

        public List<ProductDto> Products { get; set; } = new List<ProductDto>();

    }
}
