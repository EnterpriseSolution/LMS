using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Yokogawa.LMS.Platform.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Configuration
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("User");
            builder.Property(p => p.Id).HasMaxLength(36).ValueGeneratedOnAdd();
            builder.Property(p => p.UserId).IsRequired().HasMaxLength(50);
            builder.Property(p => p.DisplayName).IsRequired().HasMaxLength(200);
            builder.Property(p => p.Email).HasMaxLength(150);
            builder.Property(p => p.Company).HasMaxLength(150);
            builder.Property(p => p.Password).HasMaxLength(50);
        }
    }
}
