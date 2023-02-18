using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Yokogawa.LMS.Platform.Data.Configuration
{
    public class Config_ItemsConfiguration: IEntityTypeConfiguration<Config_Items>
    {
        public void Configure(EntityTypeBuilder<Config_Items> builder)
        {
            // Primary Key
            builder.HasKey(t => new { t.Category, t.Name });

            // Properties
            builder.Property(t => t.Category)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(t => t.Value)
                .HasMaxLength(255);

            builder.Property(t => t.Type)
                .HasMaxLength(50);

            // Table & Column Mappings
            builder.ToTable("Config_Items");
        }
    }
}
