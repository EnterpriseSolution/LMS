using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Yokogawa.Data.Infrastructure.Extensions;
using Yokogawa.LMS.Business.Data.Entities;
using Yokogawa.LMS.Business.Service.DTOs;

namespace Yokogawa.LMS.Business.Service.Projections
{
    public class CarrierProjection
    {
        public static Expression<Func<Carrier, CarrierDto>> CarrierDto
        {
            get
            {
                return (m) => new CarrierDto()
                {
                    Id = m.Id,
                    CarrierId = m.Id.ToString(),
                    CarrierCode = m.CarrierCode,
                    CarrierName = m.CarrierName,
                    Address = m.Address,
                    ValidDate = m.ValidDate,
                    Status = m.Status,
                    Remarks = m.Remarks,
                    Vessels = ConvertToVesselDtos(m.Vessels)
                }.GetAudit<CarrierDto>(m);
            }
        }


        public static List<VesselDto> ConvertToVesselDtos(ICollection<Vessel> Vessels)
        {
            Vessels = Vessels ?? new List<Vessel>();
            
            var result = Vessels.Select<Vessel, VesselDto>(m => new VesselDto()
            {
                Id = m.Id,
                CaptainName = m.CaptainName,
                CarrierId = m.CarrierId,
                ClassificationSociety = m.ClassificationSociety,
                ComparmentNumber = m.ComparmentNumber,
                DateBuilt = m.DateBuilt,
                DateDryDockDue = m.DateDryDockDue,
                DateLastInspected = m.DateLastInspected,
                Displacement = m.Displacement,
                DistanceBetweenCargoManifoldCentres = m.DistanceBetweenCargoManifoldCentres,
                DistanceMainDeckToCentreManifold = m.DistanceMainDeckToCentreManifold,
                DistanceShipsRailToManifold = m.DistanceShipsRailToManifold,
                Draught = m.Draught,
                DWT = m.DWT,
                HeightOfManifoldConnectionsLoaded = m.HeightOfManifoldConnectionsLoaded,
                HeightOfManifoldConnectionsNormal = m.HeightOfManifoldConnectionsNormal,
                MaxLoadableVolume = m.MaxLoadableVolume,
                MaxLoadableWeight = m.MaxLoadableWeight,
                MaxLoadingRate = m.MaxLoadingRate,
                MaxtargetFlowRate = m.MaxtargetFlowRate,
                NetTonnage = m.NetTonnage,
                NoOfCargoConnections = m.NoOfCargoConnections,
                ParallelBodyLength = m.ParallelBodyLength,
                PortOfRegistry = m.PortOfRegistry,
                SizeOfCargoConnections = m.SizeOfCargoConnections,
                SlopTankCapacity = m.SlopTankCapacity,
                Status = m.Status,
                TotalCubicCapacityOfTank = m.TotalCubicCapacityOfTank,
                VesselFlag = m.VesselFlag,
                VesselLength = m.VesselLength,
                VesselName = m.VesselName,
                VesselPreviousName = m.VesselPreviousName

            }.GetAudit<VesselDto>(m)).ToList();
            return result;
        }
    }
}
