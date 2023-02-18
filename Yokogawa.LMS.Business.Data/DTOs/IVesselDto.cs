using System;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.LMS.Business.Data.DTOs
{
    public interface IVesselDto : IDto<Guid>, IAuditableDto
    {
        string VesselId { get; set; }
        Guid? CarrierId { get; set; }
        string VesselName { get; set; }
        string VesselFlag { get; set; }
        decimal? MaxLoadableWeight { get; set; }
        decimal? MaxLoadableVolume { get; set; }
        decimal? DWT { get; set; }
        decimal? VesselLength { get; set; }
        decimal? MaxtargetFlowRate { get; set; }
        DateTime? DateDryDockDue { get; set; }
        string CaptainName { get; set; }
        decimal? NetTonnage { get; set; }
        DateTime? DateBuilt { get; set; }
        DateTime? DateLastInspected { get; set; }
        int? ComparmentNumber { get; set; }
        string VesselPreviousName { get; set; }
        string PortOfRegistry { get; set; }
        string ClassificationSociety { get; set; }
        decimal? TotalCubicCapacityOfTank { get; set; }
        decimal? SlopTankCapacity { get; set; }
        decimal? MaxLoadingRate { get; set; }
        int? NoOfCargoConnections { get; set; }
        string SizeOfCargoConnections { get; set; }
        decimal? DistanceBetweenCargoManifoldCentres { get; set; }
        decimal? DistanceShipsRailToManifold { get; set; }
        decimal? DistanceMainDeckToCentreManifold { get; set; }
        decimal? HeightOfManifoldConnectionsLoaded { get; set; }
        decimal? HeightOfManifoldConnectionsNormal { get; set; }
        decimal? Draught { get; set; }
        decimal? ParallelBodyLength { get; set; }
        decimal? Displacement { get; set; }
        bool Status { get; set; }
    }
}
