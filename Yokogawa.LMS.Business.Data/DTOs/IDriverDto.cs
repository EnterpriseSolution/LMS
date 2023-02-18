using System;
using Yokogawa.Data.Infrastructure.DTOs.Base;
namespace Yokogawa.LMS.Business.Data.DTOs
{
    public interface IDriverDto : IDto<Guid>, IAuditableDto
    {
        string DriverId { get; set; }
        string DriverCode { get; set; }
        string DriverName { get; set; }
        string License { get; set; }
        string PIN { get; set; }
        /// <summary>
        /// Enum:Male or Female
        /// </summary>
        int Gender { get; set; }
        int Age { get; set; }
        int YearsExperience { get; set; }
        Guid? CardId { get; set; }
        String St_CardId { get; set; }
        /// <summary>
        /// Enum:Senior  
        /// </summary>
        int DriverGrade { get; set; }
        DateTime ReTrainingDate { get; set; }
        Guid? CarrierId { get; set; }
        String St_CarrierId { get; set; }
        DateTime ValidDate { get; set; }
        /// <summary>
        /// Enum:Valid or Invalid
        /// </summary>
        bool Status { get; set; }
        string Remarks { get; set; }
    }
}
