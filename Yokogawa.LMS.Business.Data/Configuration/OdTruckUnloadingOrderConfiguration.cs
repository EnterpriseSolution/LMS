using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.LMS.Business.Data.Entities.TruckLoading;
using Yokogawa.LMS.Business.Data.Entities.TruckUnloading;

namespace Yokogawa.LMS.Business.Data.Configuration
{
    public class OdTruckUnloadingOrderConfiguration : IEntityTypeConfiguration<OdTruckUnloadingOrder>
    {
        public void Configure(EntityTypeBuilder<OdTruckUnloadingOrder> builder)
        {
            builder.ToTable("OD_TruckUnloadingOrder");
            builder.Property(e => e.Id).ValueGeneratedNever();
            builder.Property(e => e.OrderNo).IsRequired().HasMaxLength(50);
            builder.Property(e => e.UnloadingDate).HasColumnType("datetime");
            builder.Property(e => e.SourceType).IsRequired();
            builder.Property(e => e.CustomerId).IsRequired();
            builder.Property(e => e.ProductId).IsRequired();
            builder.Property(e => e.OrderQty).HasColumnType("decimal(18, 3)");
            builder.Property(e => e.UnloadingQty).HasColumnType("decimal(18, 3)");
            builder.Property(e => e.UOM).HasColumnName("UOM");
            builder.Property(e => e.CarrierId).HasColumnName("CarrierId");
            builder.Property(e => e.TruckId).HasColumnName("TruckId");
            builder.Property(e => e.FrontLicense).HasMaxLength(16);
            builder.Property(e => e.RearLicense).HasMaxLength(16);
            builder.Property(e => e.CardId).HasMaxLength(16);
            builder.Property(e => e.DriverId).HasMaxLength(16);
            builder.Property(e => e.BayNo).HasMaxLength(64);
            builder.Property(e => e.Status).HasColumnName("Status");
            builder.Property(e => e.Remarks).HasMaxLength(200);
            builder.Property(e => e.IsDeleted).HasColumnName("IsDeleted");
            builder.Property(e => e.CreatedBy).IsRequired().HasMaxLength(50);
            builder.Property(e => e.CreatedOn).HasColumnType("datetime");
            builder.Property(e => e.UpdatedBy).HasMaxLength(50);
            builder.Property(e => e.UpdatedOn).HasColumnType("datetime");
        }
    }
}
