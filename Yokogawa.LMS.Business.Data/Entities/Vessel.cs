using System;
using Yokogawa.Data.Infrastructure.Entities;

namespace Yokogawa.LMS.Business.Data.Entities
{
    public class Vessel : SoftDeleteAuditableEntity<Guid>
    {
        public Guid? CarrierId { get; set; }
        public string VesselName { get; set; }
        public string VesselFlag { get; set; }
        public decimal? MaxLoadableWeight { get; set; }
        public decimal? MaxLoadableVolume { get; set; }
        public decimal? DWT { get; set; }
        public decimal? VesselLength { get; set; }
        public decimal? MaxtargetFlowRate { get; set; }
        public DateTime? DateDryDockDue { get; set; }
        public string CaptainName { get; set; }
        public decimal? NetTonnage { get; set; }
        public DateTime? DateBuilt { get; set; }
        public DateTime? DateLastInspected { get; set; }
        public int? ComparmentNumber { get; set; }
        public string VesselPreviousName { get; set; }
        public string PortOfRegistry { get; set; }
        public string ClassificationSociety { get; set; }
        public decimal? TotalCubicCapacityOfTank { get; set; }
        public decimal? SlopTankCapacity { get; set; }
        public decimal? MaxLoadingRate { get; set; }
        public int? NoOfCargoConnections { get; set; }
        public string SizeOfCargoConnections { get; set; }
        public decimal? DistanceBetweenCargoManifoldCentres { get; set; }
        public decimal? DistanceShipsRailToManifold { get; set; }
        public decimal? DistanceMainDeckToCentreManifold { get; set; }
        public decimal? HeightOfManifoldConnectionsLoaded { get; set; }
        public decimal? HeightOfManifoldConnectionsNormal { get; set; }
        public decimal? Draught { get; set; }
        public decimal? ParallelBodyLength { get; set; }
        public decimal? Displacement { get; set; }
        public bool Status { get; set; }

        public  Carrier Carrier { get; set; }
    }
}
