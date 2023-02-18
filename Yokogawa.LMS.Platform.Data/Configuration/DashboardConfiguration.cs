using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Yokogawa.LMS.Platform.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Configuration
{
    public class DashboardConfiguration:IEntityTypeConfiguration<Dashboard>
    {
        public void Configure(EntityTypeBuilder<Dashboard> builder)
        {
            builder.ToTable("Dashboard");
            builder.Property(p => p.Id).HasMaxLength(36).ValueGeneratedOnAdd();
            builder.Property(p => p.Name).HasMaxLength(50).IsRequired();
            builder.Property(p => p.ViewModelName).HasMaxLength(50).IsRequired();
            builder.HasMany(p => p.DashboardViews).WithOne(o => o.Dashboard);
            builder.HasMany(p => p.DashboardSharings).WithOne(o => o.Dashboard);
            builder.HasMany(p => p.DashboardSharedUsers).WithOne(o => o.Dashboard);
        }
    }
}
