using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Yokogawa.LMS.Business.Data.Entities;

namespace Yokogawa.LMS.Business.Data.Configuration
{
    public class AgentConfiguration : IEntityTypeConfiguration<Agent>
    {
        public void Configure(EntityTypeBuilder<Agent> builder)
        {
            builder.ToTable("MD_Agent");
            builder.Property(p => p.Id).HasMaxLength(36).ValueGeneratedOnAdd();
            builder.Property(p => p.AgentName).IsRequired().HasMaxLength(100);
            builder.Property(p => p.AgentCode).IsRequired().HasMaxLength(50);
            builder.Property(p => p.AgentCRNo).HasMaxLength(50);
            builder.Property(p => p.Address).HasMaxLength(200);
            builder.Property(p => p.Country).HasMaxLength(100);
            builder.Property(p => p.PersonInCharge).HasMaxLength(50);
            builder.Property(p => p.Mobile).HasMaxLength(20);
            builder.Property(p => p.PhoneO).HasMaxLength(20);
            builder.Property(p => p.BillingAddress).HasMaxLength(200);
            builder.Property(p => p.BillingCountry).HasMaxLength(100);
            builder.Property(p => p.BillTelephone).HasMaxLength(20);
            builder.Property(p => p.Remarks).HasMaxLength(200);
        }
    }
}
