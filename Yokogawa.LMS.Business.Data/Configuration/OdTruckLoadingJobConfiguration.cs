using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.LMS.Business.Data.Entities.TruckLoading;
namespace Yokogawa.LMS.Business.Data.Configuration
{
    public class OdTruckLoadingJobConfiguration : IEntityTypeConfiguration<OdTruckLoadingJob>
    {
        public void Configure(EntityTypeBuilder<OdTruckLoadingJob> builder)
        {
            builder.ToTable("OD_TruckLoadingJob");
            builder.Property(e => e.Id).ValueGeneratedNever();
            builder.Property(e => e.CreatedBy).IsRequired().HasMaxLength(50);
            builder.Property(e => e.CreatedOn).HasColumnType("datetime");
            builder.Property(e => e.Destination).HasMaxLength(64);
            builder.Property(e => e.JobNo).IsRequired().HasMaxLength(64);
            builder.Property(e => e.LoadedQty).HasColumnType("decimal(18, 3)");
            builder.Property(e => e.OrderQty).HasColumnType("decimal(18, 3)");
            builder.Property(e => e.Remarks).HasMaxLength(200);
            builder.Property(e => e.SealNo).HasMaxLength(128);
            builder.Property(e => e.Uom).HasColumnName("UOM");
            builder.Property(e => e.UpdatedBy).HasMaxLength(50);
            builder.Property(e => e.UpdatedOn).HasColumnType("datetime");
        }
    }
}
