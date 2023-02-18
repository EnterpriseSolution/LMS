using System;
using System.Collections.Generic;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Business.Data.DTOs;

namespace Yokogawa.LMS.Business.Service.DTOs
{
    public class ProductDto : AuditableDto, IProductDto
    {
        public Guid Id { get; set; }
        public string ProductId { get; set; }
        public string ProductName { get; set; }
        public string HSCode { get; set; }
        /// <summary>
        /// Enum:Black Product or White Product?
        /// </summary>
        public int ProductGroup { get; set; }
        public decimal AvgVCF { get; set; }
        public decimal AvgRefDensity { get; set; }
        /// <summary>
        /// Enum:Valid or Invalid
        /// </summary>
        public bool Status { get; set; }
        public string Remarks { get; set; }
        public List<CompartmentDto> Compartments { get; set; } = new List<CompartmentDto>();
        public List<TankDto> Tanks { get; set; } = new List<TankDto>();
    }
}
