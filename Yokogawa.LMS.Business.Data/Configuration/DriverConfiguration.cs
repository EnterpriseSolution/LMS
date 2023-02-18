using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Yokogawa.LMS.Business.Data.Entities;
namespace Yokogawa.LMS.Business.Data.Configuration
{
    public class DriverConfiguration : IEntityTypeConfiguration<Driver>
    {
        public void Configure(EntityTypeBuilder<Driver> builder)
        {
  
            builder.ToTable("MD_Driver");
            builder.Property(e => e.Id).ValueGeneratedNever();
            builder.Property(e => e.DriverCode).IsRequired().HasMaxLength(50);
            builder.Property(e => e.DriverName).HasMaxLength(200);
            builder.Property(e => e.License).HasMaxLength(20);
            builder.Property(e => e.PIN).HasMaxLength(50).HasColumnName("PIN");
            builder.Property(e => e.ReTrainingDate).HasColumnType("datetime");
            builder.Property(e => e.Remarks).HasMaxLength(200);
            builder.Property(e => e.ValidDate).HasColumnType("datetime");
        }
    }
}
