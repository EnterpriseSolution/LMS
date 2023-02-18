using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Yokogawa.LMS.Platform.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Configuration
{
    public class SFAProviderConfiguration: IEntityTypeConfiguration<SFAProvider>
    {
        public void Configure(EntityTypeBuilder<SFAProvider> builder)
        {
            builder.ToTable("SFAProvider");
            builder.Property(p => p.Name).HasMaxLength(100).IsRequired();
            builder.Property(p => p.Url).HasMaxLength(100);
            builder.HasMany(p => p.SFASettings).WithOne(o => o.SFAProvider).HasForeignKey("ProviderId");



        }
    }
}
