using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Yokogawa.LMS.Business.Data.Entities;

namespace Yokogawa.LMS.Business.Data.Configuration
{
    public class JettyConfiguration : IEntityTypeConfiguration<Jetty>
    {
        public void Configure(EntityTypeBuilder<Jetty> builder)
        {
            builder.ToTable("MD_Jetty");
            builder.Property(p => p.Id).HasMaxLength(36).ValueGeneratedOnAdd();
            builder.Property(p => p.JettyNo).IsRequired().HasMaxLength(50);
            builder.Property(p => p.LOA).IsRequired().HasMaxLength(200);
            builder.Property(p => p.ManifoldHeight).HasMaxLength(150);
            builder.Property(p => p.MaxDraft).HasMaxLength(150);
            builder.Property(p => p.Status).HasMaxLength(50);
            builder.Property(p => p.Remarks).HasMaxLength(50);
        }
    }
}
