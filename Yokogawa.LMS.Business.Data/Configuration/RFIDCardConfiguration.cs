using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Yokogawa.LMS.Business.Data.Entities;

namespace Yokogawa.LMS.Business.Data.Configuration
{
    public class RFIDCardConfiguration : IEntityTypeConfiguration<RFIDCard>
    {
        public void Configure(EntityTypeBuilder<RFIDCard> builder)
        {
            builder.ToTable("MD_RFIDCard");
            builder.Property(p => p.Id).HasMaxLength(36).ValueGeneratedOnAdd();
            builder.Property(p => p.CardNo).IsRequired().HasMaxLength(50);
            builder.Property(p => p.Remarks).HasMaxLength(200);
            builder.HasMany(p => p.Drivers).WithOne(o => o.RFIDCard).HasForeignKey(o => o.CarrierId);
        }
    }
}
