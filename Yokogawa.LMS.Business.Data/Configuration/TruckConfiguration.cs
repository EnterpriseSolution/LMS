using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Yokogawa.LMS.Business.Data.Entities;
namespace Yokogawa.LMS.Business.Data.Configuration
{
    public class TruckConfiguration : IEntityTypeConfiguration<Truck>
    {
        public void Configure(EntityTypeBuilder<Truck> builder)
        {
            builder.ToTable("MD_Truck");
            builder.Property(e => e.Id).ValueGeneratedNever();
            builder.Property(e => e.InspectionDueDate).HasColumnType("datetime");
            builder.Property(e => e.LastInspectionDate).HasColumnType("datetime");
            builder.Property(e => e.Maker).HasMaxLength(200);
            builder.Property(e => e.RegisteredGrossWeight).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.RegisteredTareWeight).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.Remarks).HasMaxLength(1);
            builder.Property(e => e.TruckCode).IsRequired().HasMaxLength(50);
            builder.Property(e => e.ValidDate).HasColumnType("datetime");
            builder.Property(e => e.YearBuilt).HasColumnType("datetime");
            builder.HasMany(p => p.Compartments).WithOne(o => o.Truck).HasForeignKey(o => o.TruckId);
        }
    }
}
