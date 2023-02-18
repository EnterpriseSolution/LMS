using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Yokogawa.LMS.Platform.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Configuration
{
    public class DashboardSharedUserConfiguration : IEntityTypeConfiguration<DashboardSharedUser>
    {
        public void Configure(EntityTypeBuilder<DashboardSharedUser> builder)
        {
            builder.ToTable("DashboardSharedUser");
            builder.Property(p => p.Id).HasMaxLength(36).ValueGeneratedOnAdd();
        }
    }
}
