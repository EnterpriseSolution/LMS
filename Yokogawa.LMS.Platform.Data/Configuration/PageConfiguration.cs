using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Yokogawa.LMS.Platform.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Configuration
{
    public class PageConfiguration: IEntityTypeConfiguration<Page>
    {
        public void Configure(EntityTypeBuilder<Page> builder)
        {
            builder.ToTable("Page");
            builder.Property(p => p.Id).HasMaxLength(50);
            builder.Property(p => p.Url).HasMaxLength(100).IsRequired();
            builder.Property(p => p.Description).HasMaxLength(100).IsRequired();
            builder.HasMany(p => p.Menus).WithOne(o => o.Page);
           
        }
    }
}
