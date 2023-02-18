using System;
using System.Linq.Expressions;
using Yokogawa.Data.Infrastructure.Extensions;
using Yokogawa.LMS.Business.Data.Entities;
using Yokogawa.LMS.Business.Service.DTOs;

namespace Yokogawa.LMS.Business.Service.Projections
{
    public class DriverProjection
    {
        public static Expression<Func<Driver, DriverDto>> DriverDto
        {
            get
            {
                return (m) => new DriverDto()
                {
                    Id = m.Id,
                    DriverId = m.Id.ToString(),
                    DriverCode = m.DriverCode,
                    DriverName = m.DriverName,
                    License = m.License,
                    PIN = m.PIN,
                    Gender = m.Gender,
                    Age = m.Age,
                    YearsExperience = m.YearsExperience,
                    St_CardId =  m.CardId.ToString(),
                    St_CarrierId = m.CarrierId.ToString(),
                    DriverGrade = m.DriverGrade,
                    ReTrainingDate = m.ReTrainingDate,
                    ValidDate = m.ValidDate,
                    Status = m.Status,
                    Remarks = m.Remarks
                    
            }.GetAudit<DriverDto>(m);
            }
        }
    }
}
