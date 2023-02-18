using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Yokogawa.LMS.Platform.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Configuration
{
    class RoleWidgetSettingConfiguration: IEntityTypeConfiguration<RoleWidgetSetting>
    {
        public void Configure(EntityTypeBuilder<RoleWidgetSetting> builder)
        {
            builder.ToTable("RoleWidgetSetting");
            builder.Property(p => p.Id).HasMaxLength(36).ValueGeneratedOnAdd();
            builder.Property(p => p.RoleId).IsRequired();
            builder.Property(p => p.WidgetId).IsRequired();
            builder.Property(p => p.JSONParameter).HasMaxLength(200).IsRequired();


        }
    }
}
