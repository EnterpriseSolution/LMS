using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Yokogawa.LMS.Platform.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Configuration
{
    public class ModulePermissionConfiguration: IEntityTypeConfiguration<ModulePermission>
    {
        public void Configure(EntityTypeBuilder<ModulePermission> builder)
        {
            builder.ToTable("ModulePermission");
            builder.Property(p => p.Id).HasMaxLength(36).ValueGeneratedOnAdd();
            builder.Property(p => p.RoleId).IsRequired();
            builder.Property(p => p.WebsiteId).IsRequired();
        }
    }
}
