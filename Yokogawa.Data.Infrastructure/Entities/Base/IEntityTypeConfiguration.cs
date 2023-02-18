using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Yokogawa.Data.Infrastructure.Entities.Base
{
    public interface IEntityTypeConfiguration<T> where T : class
    {
        void Configure(EntityTypeBuilder<T> builder);
    }
}
