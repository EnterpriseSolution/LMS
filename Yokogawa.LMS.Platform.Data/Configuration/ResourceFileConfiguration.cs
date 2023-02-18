using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Yokogawa.LMS.Platform.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Configuration
{
    public class ResourceFileConfiguration : IEntityTypeConfiguration<ResourceFile>
    {
        public void Configure(EntityTypeBuilder<ResourceFile> builder)
        {
            builder.ToTable("ResourceFile");
            builder.Property(p => p.Id).HasMaxLength(36).ValueGeneratedOnAdd();
            builder.Property(p => p.FileName).HasMaxLength(50).IsRequired();
            builder.Property(p => p.FileUrl).HasMaxLength(200).IsRequired();
            builder.Property(p => p.FilePath).HasMaxLength(200).IsRequired();

        }

    }
}
