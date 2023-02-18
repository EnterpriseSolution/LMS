using System;
using System.Collections.Generic;

#nullable disable

namespace Yokogawa.LMS.Business.WebAPI.Entities
{
    public partial class OdIttorder
    {
        public Guid Id { get; set; }
        public string OrderNo { get; set; }
        public Guid FromCustomerId { get; set; }
        public Guid FromTankId { get; set; }
        public Guid ToCustomerId { get; set; }
        public Guid ToTankId { get; set; }
        public DateTime DeliveryDate { get; set; }
        public Guid FinalProductId { get; set; }
        public int SourceType { get; set; }
        public int Status { get; set; }
        public decimal OrderQty { get; set; }
        public decimal? TransferredQty { get; set; }
        public int Uom { get; set; }
        public string Remarks { get; set; }
        public bool IsDeleted { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }
}
