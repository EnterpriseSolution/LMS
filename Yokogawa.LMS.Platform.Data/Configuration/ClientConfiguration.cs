using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Yokogawa.LMS.Platform.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Configuration
{
    public class ClientConfiguration : IEntityTypeConfiguration<Client>
    {
        public void Configure(EntityTypeBuilder<Client> builder)
        {
            builder.ToTable("Client");
            builder.Property(p => p.Id).HasMaxLength(36).ValueGeneratedOnAdd();
            builder.Property(p => p.Secret).IsRequired().HasMaxLength(50);
            builder.Property(p => p.Name).IsRequired().HasMaxLength(50);
            builder.Property(p => p.ReturnUrl).HasMaxLength(100);
            builder.Property(p => p.SFAUrl).HasMaxLength(100);
        }
    }
}
