using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Yokogawa.LMS.Business.Data.Entities;

namespace Yokogawa.LMS.Business.Data.Configuration
{
    public class CarrierConfiguration : IEntityTypeConfiguration<Carrier>
    {
        public void Configure(EntityTypeBuilder<Carrier> builder)
        {
            builder.ToTable("MD_Carrier");
            builder.Property(p => p.Id).HasMaxLength(36).ValueGeneratedOnAdd();
            builder.Property(p => p.CarrierCode).IsRequired().HasMaxLength(50);
            builder.Property(p => p.CarrierName).HasMaxLength(200);
            builder.Property(p => p.Remarks).HasMaxLength(200);
            builder.HasMany(p => p.Vessels).WithOne(o => o.Carrier).HasForeignKey(o => o.CarrierId);
            builder.HasMany(p => p.Drivers).WithOne(o => o.Carrier).HasForeignKey(o => o.CarrierId);
            builder.HasMany(p => p.Trucks).WithOne(o => o.Carrier).HasForeignKey(o => o.CarrierId);
        }
    }
}
