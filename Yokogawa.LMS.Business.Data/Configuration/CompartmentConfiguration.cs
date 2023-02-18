using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Yokogawa.LMS.Business.Data.Entities;
namespace Yokogawa.LMS.Business.Data.Configuration
{
    public class CompartmentConfiguration : IEntityTypeConfiguration<Compartment>
    {
        public void Configure(EntityTypeBuilder<Compartment> builder)
        {
            builder.ToTable("MD_Compartment");
            builder.Property(e => e.Id).ValueGeneratedNever();
            builder.Property(e => e.Capacity).HasColumnType("decimal(18, 4)");
            builder.Property(e => e.CompartmentNo).IsRequired().HasMaxLength(50);
            builder.Property(e => e.Remarks).HasMaxLength(1);
          
        }
    }
}
