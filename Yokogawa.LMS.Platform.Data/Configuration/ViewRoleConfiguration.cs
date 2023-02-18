using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Yokogawa.LMS.Platform.Data.Entities;
using Microsoft.EntityFrameworkCore;


namespace Yokogawa.LMS.Platform.Data.Configuration
{
    class ViewRoleConfiguration:IEntityTypeConfiguration<ViewRole>
    {
        public void Configure(EntityTypeBuilder<ViewRole> builder)
        {
            builder.ToTable("ViewRole");
            builder.Property(p => p.Id).HasMaxLength(36).ValueGeneratedOnAdd();
            builder.Property(p => p.RoleId).IsRequired();
            builder.Property(p => p.ViewId).IsRequired();


        }
    }
}