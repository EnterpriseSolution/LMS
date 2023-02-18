using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Yokogawa.LMS.Platform.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Configuration
{
    public class UserOTPSettingConfiguration:IEntityTypeConfiguration<UserOTPSetting>
    {
        public void Configure(EntityTypeBuilder<UserOTPSetting> builder)
        {
            builder.ToTable("UserOTPSetting");
            builder.Property(p => p.Id).HasMaxLength(36).ValueGeneratedOnAdd();
            builder.Property(p => p.UserId).IsRequired().HasMaxLength(50);
            builder.Property(p => p.Secret).IsRequired().HasMaxLength(50);
            builder.Property(p => p.PinCode).HasMaxLength(6);

        }
    }
}
