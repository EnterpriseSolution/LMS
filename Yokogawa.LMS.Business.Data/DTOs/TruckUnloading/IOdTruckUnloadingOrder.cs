using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.LMS.Business.Data.DTOs.TruckUnloading
{
    public interface IOdTruckUnloadingOrder : IDto<Guid>, IAuditableDto
    {
        public Guid Id { get; set; }
        public string OrderNo { get; set; }
        public string UnloadingDate { get; set; }
        public int SourceType { get; set; }
        public string CustomerId { get; set; }
        public string ProductId { get; set; }
        public decimal OrderQty { get; set; }
        public decimal? UnloadingQty { get; set; }
        public int UOM { get; set; }
        public string CarrierId { get; set; }
        public string TruckId { get; set; }
        public string FrontLicense { get; set; }
        public string RearLicense { get; set; }
        public string CardId { get; set; }
        public string DriverId { get; set; }
        public string BayNo { get; set; }
        public int Status { get; set; }
        public string Remarks { get; set; }
        public bool IsDeleted { get; set; }       
    }
}
