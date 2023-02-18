using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Yokogawa.LMS.Platform.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Configuration
{
    public class DashboardViewConfiguration:IEntityTypeConfiguration<DashboardView>
    {
        public void Configure(EntityTypeBuilder<DashboardView> builder)
        {
            builder.ToTable("DashboardView");
            builder.Property(p => p.Id).HasMaxLength(36).ValueGeneratedOnAdd();
        }
    }
}
