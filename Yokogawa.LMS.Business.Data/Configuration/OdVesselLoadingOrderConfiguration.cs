using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.LMS.Business.Data.Entities.VesselLoading;

namespace Yokogawa.LMS.Business.Data.Configuration
{
   public class OdVesselLoadingOrderConfiguration : IEntityTypeConfiguration<OdVesselLoadingOrder>
    {
        public void Configure(EntityTypeBuilder<OdVesselLoadingOrder> builder)
        {
            builder.ToTable("OD_VesselLoadingOrder");
            builder.Property(e => e.Id).ValueGeneratedNever();
            builder.Property(e => e.CreatedBy).IsRequired().HasMaxLength(50);
            builder.Property(e => e.CreatedOn).HasColumnType("datetime");
            builder.Property(e => e.Destination).HasMaxLength(16);
            builder.Property(e => e.Eta).HasColumnType("datetime").HasColumnName("ETA");
            builder.Property(e => e.LoadedQty).HasColumnType("decimal(18, 2)");
            builder.Property(e => e.OrderNo).IsRequired().HasMaxLength(50);
            builder.Property(e => e.OrderQty).HasColumnType("decimal(18, 2)");
            builder.Property(e => e.Remarks).HasMaxLength(200);
            builder.Property(e => e.ShipmentNo).IsRequired().HasMaxLength(50);
            builder.Property(e => e.Uom).HasColumnName("UOM");
            builder.Property(e => e.UpdatedBy).HasMaxLength(50);
            builder.Property(e => e.UpdatedOn).HasColumnType("datetime");
           
        }

          
    }
}
