using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Yokogawa.LMS.Platform.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Configuration
{
    public class SFASettingConfiguration: IEntityTypeConfiguration<SFASetting>
    {
        public void Configure(EntityTypeBuilder<SFASetting> builder)
        {
            builder.ToTable("SFASetting");
            builder.Property(p => p.Id).HasMaxLength(36).ValueGeneratedOnAdd();
            builder.Property(p => p.RoleId).IsRequired();
            
            

        }
    }
}
