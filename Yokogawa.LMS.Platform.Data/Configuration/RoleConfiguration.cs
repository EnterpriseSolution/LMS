using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Yokogawa.LMS.Platform.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Configuration
{
    public class RoleConfiguration:IEntityTypeConfiguration<Role>
    {
        public void Configure(EntityTypeBuilder<Role> builder)
        {
            builder.ToTable("Role");
            builder.Property(p => p.Id).HasMaxLength(36).ValueGeneratedOnAdd();
            builder.Property(p => p.Name).IsRequired().HasMaxLength(50);
            builder.Property(p => p.Description).HasMaxLength(100);
            builder.Property(p => p.Email).HasMaxLength(150);
            builder.HasMany(p => p.UserRoles).WithOne(o => o.Role);
            //builder.HasMany(p => p.Websites).WithOne(o => o.Role).HasForeignKey("AdminRoleId");
            builder.HasMany(p => p.ViewRoles).WithOne(o => o.Role);
            builder.HasMany(p => p.SFASettings).WithOne(o => o.Role);
            builder.HasMany(p => p.RoleWidgetSettings).WithOne(o => o.Role);
            builder.HasMany(p => p.Permissions).WithOne(o => o.Role);
            builder.HasMany(p => p.ModulePermissions).WithOne(o => o.Role);
            builder.HasMany(p => p.DashboardSharings).WithOne(o => o.Role);
        }
    }
}
