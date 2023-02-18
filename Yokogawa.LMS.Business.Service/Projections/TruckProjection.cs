using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Yokogawa.Data.Infrastructure.Extensions;
using Yokogawa.LMS.Business.Data.Entities;
using Yokogawa.LMS.Business.Service.DTOs;


namespace Yokogawa.LMS.Business.Service.Projections
{
    public static class TruckProjection
    {
        public static Expression<Func<Truck, TruckDto>> TruckListDto
        {
            get
            {
                return (m) => new TruckDto()
                {
                    Id = m.Id,
                    TruckId = m.Id.ToString(),
                    CarrierId = m.CarrierId,
                    St_CarrierId = m.CarrierId == Guid.Empty ? null : m.CarrierId.ToString(),
                    InspectionDueDate = m.InspectionDueDate,
                    LastInspectionDate = m.LastInspectionDate,
                    Maker = m.Maker,
                    RegisteredGrossWeight = m.RegisteredGrossWeight,
                    RegisteredTareWeight = m.RegisteredTareWeight,
                    Remarks = m.Remarks,
                    Status = m.Status,
                    TruckCode = m.TruckCode,
                    ValidDate = m.ValidDate,
                    YearBuilt = m.YearBuilt,
                    Compartments = ConvertToCompartmentDtos(m.Compartments)
                }.GetAudit<TruckDto>(m);

            }
        }

        public static Expression<Func<Truck, TruckDto>> TruckDto
        {
            get
            {
                return (m) => new TruckDto()
                {
                    Id = m.Id,
                    TruckId = m.Id.ToString(),
                    CarrierId = m.CarrierId,
                    St_CarrierId= m.CarrierId==Guid.Empty? null: m.CarrierId.ToString(),
                    InspectionDueDate = m.InspectionDueDate,
                    LastInspectionDate = m.LastInspectionDate,
                    Maker = m.Maker,
                    RegisteredGrossWeight = m.RegisteredGrossWeight,
                    RegisteredTareWeight = m.RegisteredTareWeight,
                    Remarks = m.Remarks,
                    Status = m.Status,
                    TruckCode = m.TruckCode,
                    ValidDate = m.ValidDate,
                    YearBuilt = m.YearBuilt,
                    Compartments = ConvertToCompartmentDtos(m.Compartments)

                }.GetAudit<TruckDto>(m);
            }


        }

        public static CarrierDto ConvertToCarrierDto(this Carrier m)
        {
            return new CarrierDto()
            {
                Id = m.Id,
                CarrierName = m.CarrierName

            };
        }

        public static List<CompartmentDto> ConvertToCompartmentDtos(ICollection<Compartment> Compartments)
        {
            Compartments = Compartments ?? new List<Compartment>();
            var result = Compartments.Select<Compartment, CompartmentDto>(p => new CompartmentDto()
            {
                Id = p.Id,
                CompartmentId=p.Id.ToString(),
                Capacity = p.Capacity,
                CompartmentNo = p.CompartmentNo,
                ProductId = p.ProductId,
                St_ProductId = p.ProductId == Guid.Empty ?string.Empty: p.ProductId.ToString(),
                ProductName =p.Product?.ProductName?? string.Empty,
                Remarks = p.Remarks,
                TruckId = p.TruckId
            }.GetAudit<CompartmentDto>(p)).ToList();
            return result;
        }

        
    }
}
