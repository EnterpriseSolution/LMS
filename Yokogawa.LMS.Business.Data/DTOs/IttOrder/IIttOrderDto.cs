using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Business.Data.Entities;

namespace Yokogawa.LMS.Business.Data.DTOs.IttOrder
{
   public interface IIttOrderDto : IDto<Guid>, IAuditableDto
    {
        string OrderNo { get; set; }
        Guid FromCustomerId { get; set; }
        string St_FromCustomerId { get; set; }
        Guid FromTankId { get; set; }
        string St_FromTankId { get; set; }
        Guid ToCustomerId { get; set; }
        string St_ToCustomerId { get; set; }
        Guid ToTankId { get; set; }
        string St_ToTankId { get; set; }
        Guid FinalProductId { get; set; }
        string St_FinalProductId { get; set; }
        DateTime DeliveryDate { get; set; }
        int SourceType { get; set; }
        int Status { get; set; }
        decimal OrderQty { get; set; }
        decimal? TransferredQty { get; set; }
        int Uom { get; set; }
        string Remarks { get; set; }
    }
}
