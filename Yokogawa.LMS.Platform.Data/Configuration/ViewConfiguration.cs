using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Yokogawa.LMS.Platform.Data.Entities;
using Microsoft.EntityFrameworkCore;


namespace Yokogawa.LMS.Platform.Data.Configuration
{
    class ViewConfiguration:IEntityTypeConfiguration<View>
    {
        public void Configure(EntityTypeBuilder<View> builder)
        {
            builder.ToTable("View");
            builder.Property(p => p.Id).HasMaxLength(36).ValueGeneratedOnAdd();
            builder.Property(p => p.Name).HasMaxLength(50).IsRequired();
            builder.Property(p => p.Description).HasMaxLength(100).IsRequired();
            builder.Property(p => p.Model).HasMaxLength(2000).IsRequired();
            builder.Property(p => p.Action).HasMaxLength(200).IsRequired();
            builder.Property(p => p.ViewModelType).IsRequired();
            builder.HasMany(p => p.DashboardViews).WithOne(o => o.View);
            builder.HasMany(p => p.ViewRoles).WithOne(o => o.View);


        }
    }
}