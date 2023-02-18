using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Yokogawa.LMS.Business.Data.Entities;

namespace Yokogawa.LMS.Business.Data.Configuration
{
    public class TankConfiguration : IEntityTypeConfiguration<Tank>
    {
        public void Configure(EntityTypeBuilder<Tank> builder)
        {
            builder.ToTable("MD_Tank");
            builder.Property(e => e.Id).ValueGeneratedNever();
            builder.Property(e => e.CenterDatumLimit).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.CriticalZoneFrom).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.CriticalZoneTo).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.FloatingRoofCorrectionLevel).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.MaxOperationVolume).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.MaxSafeLevel).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.RefHeight).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.Remarks).HasMaxLength(200);
            builder.Property(e => e.RoofWeight).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.TankNo).IsRequired().HasMaxLength(20);


        }
    }
}
