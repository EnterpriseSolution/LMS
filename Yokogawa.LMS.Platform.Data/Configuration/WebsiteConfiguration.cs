using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Yokogawa.LMS.Platform.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Configuration
{
    public class WebsiteConfiguration: IEntityTypeConfiguration<Website>
    {
        public void Configure(EntityTypeBuilder<Website> builder)
        {
            builder.ToTable("Website");
            builder.Property(p => p.Id).HasMaxLength(36).ValueGeneratedOnAdd();
            builder.Property(p => p.Name).IsRequired();
            builder.Property(p => p.HomePageId).IsRequired();
            builder.HasMany(p => p.Menus).WithOne(o => o.Website);
            builder.HasMany(p => p.Dashboards).WithOne(o => o.Website);
            builder.HasOne(p => p.HomePage).WithMany(o => o.Websites);
            builder.HasMany(p => p.Roles).WithOne(o => o.Website).HasForeignKey(o => o.DefaultWebsiteId);
            builder.HasMany(p => p.Users).WithOne(o => o.Website).HasForeignKey(o => o.DefaultWebsiteId);
            builder.HasMany(p => p.ADUsers).WithOne(o => o.Website).HasForeignKey(o => o.DefaultWebsiteId);
            builder.HasMany(p => p.Widgets).WithOne(o => o.Website).HasForeignKey(o => o.DefaultWebsiteId);
            builder.HasMany(p => p.ResourceFiles).WithOne(o => o.Website).HasForeignKey(o => o.WebsiteId);
            builder.HasMany(p => p.Views).WithOne(o => o.Website).HasForeignKey(o => o.DefaultWebsiteId);
        }
    }
}
