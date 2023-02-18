using System;
using System.Collections.Generic;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Business.Data.DTOs;

namespace Yokogawa.LMS.Business.Service.DTOs
{
    public class CarrierDto : AuditableDto, ICarrierDto
    {
        public Guid Id { get; set; }
        public string CarrierId { get; set; }
        public string CarrierCode { get; set; }
        public string CarrierName { get; set; }
        public string Address { get; set; }
        public DateTime ValidDate { get; set; }
        /// <summary>
        /// Enum:Valid or Invalid
        /// </summary>
        public bool Status { get; set; }
        public string Remarks { get; set; }
        public List<VesselDto> Vessels { get; set; } = new List<VesselDto>();
        public List<DriverDto> Drivers { get; set; } = new List<DriverDto>();
        public List<TruckDto> Trucks { get; set; } = new List<TruckDto>();
    }
}
