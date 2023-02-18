using Microsoft.EntityFrameworkCore;
using Yokogawa.Data.Infrastructure;
using Yokogawa.LMS.Business.Data.Configuration;
using Yokogawa.LMS.Business.Data.Entities;
using System.Configuration;
using Yokogawa.LMS.Business.Data.Entities.TruckLoading;
using Yokogawa.LMS.Business.Data.Entities.TruckUnloading;
using Yokogawa.LMS.Business.Data.Entities.VesselLoading;
using Yokogawa.LMS.Business.Data.Entities.PipelineOrder;
using Yokogawa.LMS.Business.Data.Entities.IttOrder;

namespace Yokogawa.LMS.Business.Data
{
    public class LMSDBContext : GenericDbContext
    {

        public LMSDBContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Jetty> Jetties { get; set; }

        public DbSet<Product> Products { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Agent> Agents { get; set; }
        public DbSet<RFIDCard> RFIDCards { get; set; }
        public DbSet<Carrier> Carriers { get; set; }
        public DbSet<Driver> Drivers { get; set; }
        public DbSet<Vessel> Vessels { get; set; }
        public DbSet<Tank> Tanks { get; set; }
        public DbSet<Compartment> Compartments { get; set; }

        public DbSet<Truck> Trucks { get; set; }
        public DbSet<OdTruckLoadingJob> OdTruckLoadingJobs { get; set; }
        public DbSet<OdTruckLoadingOrder> OdTruckLoadingOrders { get; set; }

        public DbSet<OdTruckUnloadingOrder> OdTruckUnloadingOrders { get; set; }
        public DbSet<OdVesselDischargeOrder> OdVesselDischargeOrders { get; set; }
        public  DbSet<OdVesselLoadingOrder> OdVesselLoadingOrders { get; set; }
        public DbSet<OdIttOrder> OdIttOrders { get; set; }
        public DbSet<OdPipelineOrder> OdPipelineOrders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Jetty>(new JettyConfiguration().Configure);
            modelBuilder.Entity<Product>(new ProductConfiguration().Configure);
            modelBuilder.Entity<Customer>(new CustomerConfiguration().Configure);
            modelBuilder.Entity<Agent>(new AgentConfiguration().Configure);
            modelBuilder.Entity<RFIDCard>(new RFIDCardConfiguration().Configure);
            modelBuilder.Entity<Carrier>(new CarrierConfiguration().Configure);
            modelBuilder.Entity<Driver>(new DriverConfiguration().Configure);
            modelBuilder.Entity<Vessel>(new VesselConfiguration().Configure);
            modelBuilder.Entity<Tank>(new TankConfiguration().Configure);
            modelBuilder.Entity<Compartment>(new CompartmentConfiguration().Configure);
            modelBuilder.Entity<Truck>(new TruckConfiguration().Configure);

            modelBuilder.Entity<OdTruckLoadingJob>(new OdTruckLoadingJobConfiguration().Configure);
            modelBuilder.Entity<OdTruckLoadingOrder>(new OdTruckLoadingOrderConfiguration().Configure);
            modelBuilder.Entity<OdTruckUnloadingOrder>(new OdTruckUnloadingOrderConfiguration().Configure);
            modelBuilder.Entity<OdVesselDischargeOrder>(new OdVesselDischargeOrderConfiguration().Configure);
            modelBuilder.Entity<OdVesselLoadingOrder>(new OdVesselLoadingOrderConfiguration().Configure);
            modelBuilder.Entity<OdIttOrder>(new IttOrderConfiguration().Configure);
            modelBuilder.Entity<OdPipelineOrder>(new OdPipelineOrderConfiguration().Configure);            
        }
    }
}
