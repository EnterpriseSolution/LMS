using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Yokogawa.LMS.Business.Data.Entities.PipelineOrder;

namespace Yokogawa.LMS.Business.Data.Configuration
{
    public class OdPipelineOrderConfiguration : IEntityTypeConfiguration<OdPipelineOrder>
    {
        public void Configure(EntityTypeBuilder<OdPipelineOrder> builder)
        {
            builder.ToTable("OD_PipelineOrder");
            builder.Property(e => e.Id).ValueGeneratedNever();
            builder.Property(e => e.OrderNo).IsRequired().HasMaxLength(50);
            builder.Property(e => e.DeliveryDate).HasColumnType("datetime");
            builder.Property(e => e.SourceType).IsRequired();
            builder.Property(e => e.Status).HasColumnName("Status");
            builder.Property(e => e.ProductId).IsRequired();
            builder.Property(e => e.OrderQty).HasColumnType("decimal(18, 2)");
            builder.Property(e => e.TransferredQty).HasColumnType("decimal(18, 2)");
            builder.Property(e => e.UOM).HasColumnName("UOM");
            builder.Property(e => e.Destination).HasMaxLength(64);
            builder.Property(e => e.CustomerId);
            builder.Property(e => e.Remarks).HasMaxLength(200);
            builder.Property(e => e.IsDeleted).HasColumnName("IsDeleted");         
            builder.Property(e => e.CreatedBy).IsRequired().HasMaxLength(50);
            builder.Property(e => e.CreatedOn).HasColumnType("datetime");
            builder.Property(e => e.UpdatedBy).HasMaxLength(50);
            builder.Property(e => e.UpdatedOn).HasColumnType("datetime");
        }
    }
}
