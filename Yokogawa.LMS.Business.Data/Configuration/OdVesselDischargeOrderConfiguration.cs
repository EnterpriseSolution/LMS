using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.LMS.Business.Data.Entities;
using Yokogawa.LMS.Business.Data.Entities.TruckLoading;
using Yokogawa.LMS.Business.Data.Entities.TruckUnloading;

namespace Yokogawa.LMS.Business.Data.Configuration
{
    public class OdVesselDischargeOrderConfiguration : IEntityTypeConfiguration<OdVesselDischargeOrder>
    {
        public void Configure(EntityTypeBuilder<OdVesselDischargeOrder> builder)
        {
            builder.ToTable("OD_VesselDischargeOrder");
            builder.Property(e => e.Id).ValueGeneratedNever();
            builder.Property(e => e.OrderNo).IsRequired().HasMaxLength(50);
            builder.Property(e => e.ShipmentNo).IsRequired().HasMaxLength(50);
            builder.Property(e => e.VesselId).IsRequired();
            builder.Property(e => e.OperationType).IsRequired();
            builder.Property(e => e.ETA).IsRequired().HasColumnType("datetime");
            builder.Property(e => e.SourceType).IsRequired();
            builder.Property(e => e.ProductId).IsRequired();
            builder.Property(e => e.JettyId);
            builder.Property(e => e.OrderQty).IsRequired().HasColumnType("decimal(18, 2)");
            builder.Property(e => e.LoadedQty).HasColumnType("decimal(18, 2)");
            builder.Property(e => e.UOM).IsRequired().HasColumnName("UOM").IsRequired();
            builder.Property(e => e.CustomerId);
            builder.Property(e => e.Status).IsRequired().HasColumnName("Status");
            builder.Property(e => e.Remarks).HasMaxLength(200);
            builder.Property(e => e.IsDeleted).IsRequired().HasColumnName("IsDeleted");
            builder.Property(e => e.CreatedBy).IsRequired().HasMaxLength(50);
            builder.Property(e => e.CreatedOn).HasColumnType("datetime");
            builder.Property(e => e.UpdatedBy).HasMaxLength(50);
            builder.Property(e => e.UpdatedOn).HasColumnType("datetime");        
        }
    }
}
