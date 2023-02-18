using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Yokogawa.LMS.Platform.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Configuration
{
    public class TrustDomainConfiguration: IEntityTypeConfiguration<TrustDomain>
    {
        public void Configure(EntityTypeBuilder<TrustDomain> builder)
        {
            builder.ToTable("TrustDomain");
            builder.Property(p => p.Domain).HasMaxLength(30);
            builder.Property(p => p.DomainUser).HasMaxLength(50);
            builder.Property(p => p.Password).HasMaxLength(50);
        }

    }
}
