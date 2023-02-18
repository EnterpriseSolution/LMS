using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Yokogawa.LMS.Platform.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Configuration
{
    public class RefreshTokenConfiguration:IEntityTypeConfiguration<RefreshToken>
    {
        public void Configure(EntityTypeBuilder<RefreshToken> builder)
        {
            builder.ToTable("RefreshToken");
            builder.Property(p => p.Id).IsRequired().HasMaxLength(50);
            builder.Property(p => p.UserId).IsRequired().HasMaxLength(50);
            builder.Property(p => p.ProtectedTicket).IsRequired().HasMaxLength(2000);
            builder.HasOne("Client");
        }
    }
}
