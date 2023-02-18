using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Yokogawa.LMS.Business.Data.Entities;


using Yokogawa.LMS.Business.Data.Entities.IttOrder;

namespace Yokogawa.LMS.Business.Data.Configuration
{
    public class IttOrderConfiguration : IEntityTypeConfiguration<OdIttOrder>
    {
        public void Configure(EntityTypeBuilder<OdIttOrder> builder)
        {
            builder.ToTable("OD_ITTOrder");
            builder.Property(e => e.Id).ValueGeneratedNever();
            builder.Property(e => e.CreatedBy).IsRequired().HasMaxLength(50);
            builder.Property(e => e.CreatedOn).HasColumnType("datetime");
            builder.Property(e => e.DeliveryDate).HasColumnType("datetime");
            builder.Property(e => e.OrderNo).IsRequired().HasMaxLength(50);
            builder.Property(e => e.OrderQty).HasColumnType("decimal(18, 2)");
            builder.Property(e => e.Remarks).HasMaxLength(200);
            builder.Property(e => e.TransferredQty).HasColumnType("decimal(18, 2)");
            builder.Property(e => e.Uom).HasColumnName("UOM");
            builder.Property(e => e.UpdatedBy).HasMaxLength(50);
            builder.Property(e => e.UpdatedOn).HasColumnType("datetime");
            //builder.HasOne(p => p.FromCustomer).WithOne(o => o.OdIttOrder).HasForeignKey<OdIttOrder>(p => p.FromCustomerId);
            //builder.HasOne(p => p.ToCustomer).WithOne(o => o.OdIttOrder2).HasForeignKey<OdIttOrder>(p => p.ToCustomerId);

        }
    }
}
