using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;

namespace Yokogawa.LMS.Business.Data.Entities.TruckUnloading
{
    public class OdTruckUnloadingOrder : SoftDeleteAuditableEntity<Guid>
    {        
        public string OrderNo { get; set; }
        public DateTime UnloadingDate { get; set; }
        public int SourceType { get; set; }
        public Guid CustomerId { get; set; }
        public Guid ProductId { get; set; }
        public decimal OrderQty { get; set; }
        public decimal? UnloadingQty { get; set; }
        public int UOM { get; set; }
        public Guid? CarrierId { get; set; }
        public Guid? TruckId { get; set; }
        public string FrontLicense { get; set; }
        public string RearLicense { get; set; }
        public Guid? CardId { get; set; }
        public Guid? DriverId { get; set; }
        public string BayNo { get; set; }
        public int Status { get; set; }
        public string Remarks { get; set; }
    }
}
