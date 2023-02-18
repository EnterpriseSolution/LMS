using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Yokogawa.LMS.Platform.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Configuration
{
    public class ContactConfiguration:IEntityTypeConfiguration<Contact>
    {
        public void Configure(EntityTypeBuilder<Contact> builder)
        {
            builder.ToTable("Contact");
            builder.Property(p => p.Id).HasMaxLength(36).ValueGeneratedOnAdd();
            builder.Property(p => p.UserId).HasMaxLength(50).IsRequired();
            builder.Property(p => p.ContactName).HasMaxLength(80).IsRequired();
            builder.Property(p => p.ContactEmail).HasMaxLength(80).IsRequired();
 
        }
    }
}
