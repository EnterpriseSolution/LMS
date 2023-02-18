using System;
using System.Linq.Expressions;
using Yokogawa.Data.Infrastructure.Extensions;
using Yokogawa.LMS.Business.Data.Entities;
using Yokogawa.LMS.Business.Service.DTOs;

namespace Yokogawa.LMS.Business.Service.Projections
{
    public class VesselProjection
    {
        public static Expression<Func<Vessel, VesselDto>> VesselDto
        {
            get
            {
                return (m) => new VesselDto()
                {
                    Id = m.Id,
                    VesselId = m.Id.ToString(),
                    CarrierId = m.CarrierId,
                    VesselName = m.VesselName,
                    VesselFlag = m.VesselFlag,
                    MaxLoadableWeight = m.MaxLoadableWeight,
                    MaxLoadableVolume = m.MaxLoadableVolume,
                    DWT = m.DWT,
                    VesselLength = m.VesselLength,
                    MaxtargetFlowRate = m.MaxtargetFlowRate,
                    DateDryDockDue = m.DateDryDockDue,
                    CaptainName = m.CaptainName,
                    NetTonnage = m.NetTonnage,
                    DateBuilt = m.DateBuilt,
                    DateLastInspected = m.DateLastInspected,
                    ComparmentNumber = m.ComparmentNumber,
                    VesselPreviousName = m.VesselPreviousName,
                    PortOfRegistry = m.PortOfRegistry,
                    ClassificationSociety = m.ClassificationSociety,
                    TotalCubicCapacityOfTank = m.TotalCubicCapacityOfTank,
                    SlopTankCapacity = m.SlopTankCapacity,
                    MaxLoadingRate = m.MaxLoadingRate,
                    NoOfCargoConnections = m.NoOfCargoConnections,
                    SizeOfCargoConnections = m.SizeOfCargoConnections,
                    DistanceBetweenCargoManifoldCentres = m.DistanceBetweenCargoManifoldCentres,
                    DistanceShipsRailToManifold = m.DistanceShipsRailToManifold,
                    DistanceMainDeckToCentreManifold = m.DistanceMainDeckToCentreManifold,
                    HeightOfManifoldConnectionsLoaded = m.HeightOfManifoldConnectionsLoaded,
                    HeightOfManifoldConnectionsNormal = m.HeightOfManifoldConnectionsNormal,
                    Draught = m.Draught,
                    ParallelBodyLength = m.ParallelBodyLength,
                    Displacement = m.Displacement,
                    Status = m.Status
                }.GetAudit<VesselDto>(m);
            }
        }
    }
}
