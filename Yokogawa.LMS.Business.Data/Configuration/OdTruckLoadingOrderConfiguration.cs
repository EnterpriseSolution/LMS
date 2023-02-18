using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.LMS.Business.Data.Entities.TruckLoading;
namespace Yokogawa.LMS.Business.Data.Configuration
{
    public class OdTruckLoadingOrderConfiguration : IEntityTypeConfiguration<OdTruckLoadingOrder>
    {
        public void Configure(EntityTypeBuilder<OdTruckLoadingOrder> builder)
        {
            builder.ToTable("OD_TruckLoadingOrder");
            builder.Property(e => e.Id).ValueGeneratedNever();
            builder.Property(e => e.BayNo).HasMaxLength(64);
            builder.Property(e => e.CreatedBy).IsRequired().HasMaxLength(50);
            builder.Property(e => e.CreatedOn).HasColumnType("datetime");
            builder.Property(e => e.DeliveryDate).HasColumnType("datetime");
            builder.Property(e => e.FrontLicense).HasMaxLength(16);
            builder.Property(e => e.OrderNo).IsRequired().HasMaxLength(50);
            builder.Property(e => e.RearLicense).HasMaxLength(16);
            builder.Property(e => e.Remarks).HasMaxLength(200);
            builder.Property(e => e.UpdatedBy).HasMaxLength(50);
            builder.Property(e => e.UpdatedOn).HasColumnType("datetime");
            builder.HasMany(p => p.OdTruckLoadingJobs).WithOne(o => o.Order).HasForeignKey(o => o.OrderId);
        }
    }
}
