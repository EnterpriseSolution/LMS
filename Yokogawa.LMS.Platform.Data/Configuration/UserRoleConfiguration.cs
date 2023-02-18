using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Yokogawa.LMS.Platform.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Configuration
{
    public class UserRoleConfiguration:IEntityTypeConfiguration<UserRole>
    {
        public void Configure(EntityTypeBuilder<UserRole> builder)
        {
            builder.ToTable("UserRole");
            builder.Property(p => p.Id).HasMaxLength(36).ValueGeneratedOnAdd();
            builder.Property(p => p.UserId).IsRequired().HasMaxLength(50);
            builder.Property(p => p.RoleId).IsRequired();
        }
    }
}
