using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;

namespace Yokogawa.LMS.Business.Data.Entities.TruckLoading
{
    public class OdTruckLoadingOrder : SoftDeleteAuditableEntity<Guid>
    {
       
        public string OrderNo { get; set; }
        public DateTime DeliveryDate { get; set; }
        public int SourceType { get; set; }
        public int Status { get; set; }
      
        public string FrontLicense { get; set; }
        public string RearLicense { get; set; }
        public string BayNo { get; set; }
        public string Remarks { get; set; }
        public Guid? CarrierId { get; set; }
        public Guid TruckId { get; set; }
        public Guid? CardId { get; set; }
        public Guid? DriverId { get; set; }
 

        public ICollection<OdTruckLoadingJob> OdTruckLoadingJobs { get; set; }


    }
}
