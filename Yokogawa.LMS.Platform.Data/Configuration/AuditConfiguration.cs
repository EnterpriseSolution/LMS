using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Yokogawa.Data.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Configuration
{
    public class AuditConfiguration : IEntityTypeConfiguration<Audit>
    {
        public void Configure(EntityTypeBuilder<Audit> builder)
        {
            builder.ToTable("Audit");
            builder.Property(p => p.Id).HasMaxLength(36).ValueGeneratedOnAdd();
        }
    }
}
