using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace Yokogawa.LMS.Business.WebAPI.Entities
{
    public partial class LMSContext : DbContext
    {
        public LMSContext()
        {
        }

        public LMSContext(DbContextOptions<LMSContext> options)
            : base(options)
        {
        }

        public virtual DbSet<OdIttorder> OdIttorders { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=192.168.156.125;Initial Catalog=LMS;user id=sa;password=sasa");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<OdIttorder>(entity =>
            {
                entity.ToTable("OD_ITTOrder");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.CreatedBy)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.DeliveryDate).HasColumnType("datetime");

                entity.Property(e => e.OrderNo)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.OrderQty).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Remarks).HasMaxLength(200);

                entity.Property(e => e.TransferredQty).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Uom).HasColumnName("UOM");

                entity.Property(e => e.UpdatedBy).HasMaxLength(50);

                entity.Property(e => e.UpdatedOn).HasColumnType("datetime");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
