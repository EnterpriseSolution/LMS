using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Yokogawa.LMS.Business.Data.Entities;

namespace Yokogawa.LMS.Business.Data.Configuration
{
    public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
    {
        public void Configure(EntityTypeBuilder<Customer> builder)
        {
            builder.ToTable("MD_Customer");
            builder.Property(p => p.Id).HasMaxLength(36).ValueGeneratedOnAdd();
            builder.Property(p => p.CustomerName).IsRequired().HasMaxLength(100);
            builder.Property(p => p.CustomerCode).IsRequired().HasMaxLength(100);
            builder.Property(p => p.CustomerAlias).IsRequired().HasMaxLength(50);
            builder.Property(p => p.CustomerCRNo).HasMaxLength(50);
            builder.Property(p => p.Address).HasMaxLength(200);
            builder.Property(p => p.Country).HasMaxLength(100);
            builder.Property(p => p.PersonInCharge).HasMaxLength(50);
            builder.Property(p => p.Mobile).HasMaxLength(20);
            builder.Property(p => p.PhoneO).HasMaxLength(20);
            builder.Property(p => p.PhoneR).HasMaxLength(20);
            builder.Property(p => p.Fax).HasMaxLength(50);
            builder.Property(p => p.BillingAddress).HasMaxLength(200);
            builder.Property(p => p.BillingCountry).HasMaxLength(100);
            builder.Property(p => p.BillTelephone).HasMaxLength(20);
            builder.Property(p => p.Remarks).HasMaxLength(200);
        }
    }
}
