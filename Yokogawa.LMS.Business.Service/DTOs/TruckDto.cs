using System;
using System.Collections.Generic;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Business.Data.DTOs;

namespace Yokogawa.LMS.Business.Service.DTOs
{
    public class TruckDto : AuditableDto, ITruckDto
    {
        public Guid Id { get; set; }
        public string TruckId { get; set; }
        public string TruckCode { get; set; }
        public string Maker { get; set; }
        public DateTime? YearBuilt { get; set; }
        public String St_YearBuilt { get; set; }
        public decimal? RegisteredTareWeight { get; set; }
        public decimal? RegisteredGrossWeight { get; set; }
        public DateTime? LastInspectionDate { get; set; }
        public DateTime? InspectionDueDate { get; set; }
        public DateTime? ValidDate { get; set; }
        public Guid? CarrierId { get; set; }
        public String St_CarrierId { get; set; }
        public bool Status { get; set; }
        public string Remarks { get; set; }
        public List<CompartmentDto> Compartments { get; set; } = new List<CompartmentDto>();
       
        

    }
}
