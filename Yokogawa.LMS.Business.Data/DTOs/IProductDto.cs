using System;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.LMS.Business.Data.DTOs
{
    public interface IProductDto : IDto<Guid>, IAuditableDto
    {
        string ProductId { get; set; }
        string ProductName { get; set; }
        string HSCode { get; set; }
        /// <summary>
        /// Enum:Black Product or White Product?
        /// </summary>
        int ProductGroup { get; set; }
        decimal AvgVCF { get; set; }
        decimal AvgRefDensity { get; set; }
        /// <summary>
        /// Enum:Valid or Invalid
        /// </summary>
        bool Status { get; set; }
        string Remarks { get; set; }
    }
}
