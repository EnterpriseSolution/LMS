using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Yokogawa.LMS.Platform.Data.Entities;
using Microsoft.EntityFrameworkCore;


namespace Yokogawa.LMS.Platform.Data.Configuration
{
    public class WidgetConfiguration:IEntityTypeConfiguration<Widget>
    {
        public void Configure(EntityTypeBuilder<Widget> builder)
        {
            builder.ToTable("Widget");
            builder.Property(p => p.Id).HasMaxLength(36).ValueGeneratedOnAdd();
            builder.Property(p => p.Name).HasMaxLength(50).IsRequired();
            builder.Property(p => p.InstanceName).HasMaxLength(50).IsRequired();
            builder.Property(p => p.Description).HasMaxLength(100).IsRequired();
            builder.Property(p => p.SourceFilePath).HasMaxLength(100);
            builder.Property(p => p.ServiceUrl).HasMaxLength(100);
            builder.Property(p => p.TemplateFileFolder).HasMaxLength(50).IsRequired();
 
            builder.HasMany(p => p.ResourceFiles).WithOne(o => o.Widget);
            builder.HasMany(p => p.RoleWidgetSettings).WithOne(o => o.Widget);
            builder.HasMany(p => p.Views).WithOne(o => o.Widget);
            builder.HasOne(p => p.WidgetTemplate).WithMany(o => o.ReferencedWidgets);
        }
    }
}