using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Yokogawa.LMS.Platform.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Configuration
{
    public class DashboardSharingConfiguration : IEntityTypeConfiguration<DashboardSharing>
    {
        public void Configure(EntityTypeBuilder<DashboardSharing> builder)
        {
            builder.ToTable("DashboardSharing");
            builder.Property(p => p.Id).HasMaxLength(36).ValueGeneratedOnAdd();
        }
    }
}
