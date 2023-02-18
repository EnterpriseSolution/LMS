using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Yokogawa.LMS.Business.Data.Entities;

namespace Yokogawa.LMS.Business.Data.Configuration
{
    public class VesselConfiguration : IEntityTypeConfiguration<Vessel>
    {
        public void Configure(EntityTypeBuilder<Vessel> builder)
        {
            builder.ToTable("MD_Vessel");
            builder.Property(e => e.Id).ValueGeneratedNever();
            builder.Property(e => e.CaptainName).HasMaxLength(50);
            builder.Property(e => e.ClassificationSociety).HasMaxLength(100);
            builder.Property(e => e.DateBuilt).HasColumnType("datetime");
            builder.Property(e => e.DateDryDockDue).HasColumnType("datetime");
            builder.Property(e => e.DateLastInspected).HasColumnType("datetime");
            builder.Property(e => e.Displacement).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.DistanceBetweenCargoManifoldCentres).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.DistanceMainDeckToCentreManifold).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.DistanceShipsRailToManifold).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.Draught).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.DWT).HasColumnType("decimal(18,4)").HasColumnName("DWT");
            builder.Property(e => e.HeightOfManifoldConnectionsLoaded).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.HeightOfManifoldConnectionsNormal).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.MaxLoadableVolume).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.MaxLoadableWeight).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.MaxLoadingRate).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.MaxtargetFlowRate).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.NetTonnage).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.ParallelBodyLength).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.PortOfRegistry).HasMaxLength(100);
            builder.Property(e => e.SizeOfCargoConnections).HasMaxLength(100);
            builder.Property(e => e.SlopTankCapacity).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.TotalCubicCapacityOfTank).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.VesselFlag).HasMaxLength(100);
            builder.Property(e => e.VesselLength).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.VesselName).IsRequired().HasMaxLength(100);
            builder.Property(e => e.VesselPreviousName).HasMaxLength(100);

        }
    }
}
