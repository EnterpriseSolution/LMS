using System;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Business.Data.DTOs;

namespace Yokogawa.LMS.Business.Service.DTOs
{
    public class DriverDto : AuditableDto, IDriverDto
    {
        public Guid Id { get; set; }
        public string DriverId { get; set; }
        public string DriverCode { get; set; }
        public string DriverName { get; set; }
        public string License { get; set; }
        public string PIN { get; set; }
        /// <summary>
        /// Enum:Male or Female
        /// </summary>
        public int Gender { get; set; }
        public int Age { get; set; }
        public int YearsExperience { get; set; }
        public Guid? CardId { get; set; }
        public string St_CardId { get; set; }
        /// <summary>
        /// Enum:Senior  
        /// </summary>
        public int DriverGrade { get; set; }
        public DateTime ReTrainingDate { get; set; }
        public Guid? CarrierId { get; set; }
        public string St_CarrierId { get; set; }
        public DateTime ValidDate { get; set; }
        /// <summary>
        /// Enum:Valid or Invalid
        /// </summary>
        public bool Status { get; set; }
        public string Remarks { get; set; }
        
    }
}
