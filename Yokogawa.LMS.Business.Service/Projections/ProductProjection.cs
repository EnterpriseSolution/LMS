using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Yokogawa.Data.Infrastructure.Extensions;
using Yokogawa.LMS.Business.Data.Entities;
using Yokogawa.LMS.Business.Service.DTOs;

namespace Yokogawa.LMS.Business.Service.Projections
{
    public class ProductProjection
    {
        public static Expression<Func<Product, ProductDto>> ProductDto
        {
            get
            {
                return (m) => new ProductDto()
                {
                    Id = m.Id,
                    ProductId = m.Id.ToString(),
                    ProductName = m.ProductName,
                    ProductGroup = m.ProductGroup,
                    HSCode = m.HSCode,
                    AvgVCF = m.AvgVCF,
                    AvgRefDensity = m.AvgRefDensity,
                    Status = m.Status,
                    Remarks = m.Remarks,
                    Compartments = ConvertToCompartmentDtos(m.Compartments),
                    Tanks = ConvertToTankDtos(m.Tanks)
                }.GetAudit<ProductDto>(m);
            }
        }

        public static List<CompartmentDto> ConvertToCompartmentDtos(ICollection<Compartment> Compartments)
        {
            Compartments = Compartments ?? new List<Compartment>();
            var result = Compartments.Select<Compartment, CompartmentDto>(p => new CompartmentDto()
            {
                Id = p.Id,
                Capacity = p.Capacity,
                CompartmentNo = p.CompartmentNo,
                ProductId = p.ProductId,
                Remarks = p.Remarks,
                TruckId = p.TruckId
            }.GetAudit<CompartmentDto>(p)).ToList();
            return result;
        }

        public static List<TankDto> ConvertToTankDtos(ICollection<Tank> Tanks)
        {
            Tanks = Tanks ?? new List<Tank>();
            var result = Tanks.Select<Tank, TankDto>(p => new TankDto()
            {
                CenterDatumLimit = p.CenterDatumLimit,
                CriticalZoneFrom = p.CriticalZoneFrom,
                CriticalZoneTo = p.CriticalZoneTo,
                FloatingRoofCorrectionLevel = p.FloatingRoofCorrectionLevel,
                MaxOperationVolume = p.MaxOperationVolume,
                MaxSafeLevel = p.MaxSafeLevel,
                ProductId = p.ProductId.ToString(),
                RefHeight = p.RefHeight,
                Remarks = p.Remarks,
                RoofWeight = p.RoofWeight,
                Status = p.Status,
                TankNo = p.TankNo,
                TankType = p.TankType
            }.GetAudit<TankDto>(p)).ToList();
            return result;
        }
    }
}
