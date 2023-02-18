using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Yokogawa.LMS.Business.Data.Entities;
namespace Yokogawa.LMS.Business.Data.Configuration
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.ToTable("MD_Product");
            builder.Property(e => e.Id).ValueGeneratedNever();
            builder.Property(e => e.AvgRefDensity).HasColumnType("decimal(18, 6)");
            builder.Property(e => e.AvgVCF).HasColumnType("decimal(18, 8)").HasColumnName("AvgVCF");
            builder.Property(e => e.HSCode).IsRequired().HasMaxLength(50).HasColumnName("HSCode");
            builder.Property(e => e.ProductName).IsRequired().HasMaxLength(50);
            builder.Property(e => e.Remarks).HasMaxLength(2000);
            builder.HasMany(p => p.Compartments).WithOne(d => d.Product).HasForeignKey(d => d.ProductId);
            builder.HasMany(d => d.Tanks).WithOne(p => p.Product).HasForeignKey(d => d.ProductId);
        }
    }
}
