using Microsoft.Extensions.DependencyInjection;
using Yokogawa.LMS.Business.Service.Services.Interfaces.TruckLoading;
using Yokogawa.LMS.Business.Service.Services.Interfaces.TruckUnloading;
using Yokogawa.LMS.Business.Service.Services.Interfaces.VesselLoadingOrder;
using Yokogawa.LMS.Business.Service.Services.TruckLoading;
using Yokogawa.LMS.Business.Service.Services.VesselLoadingOrder;
using Yokogawa.LMS.Business.Service.Services.Interfaces.IttOrder;
using Yokogawa.LMS.Business.Services;
using Yokogawa.LMS.Business.Services.Interfaces;
using Yokogawa.LMS.Business.Service.Services.IttOrder;

namespace Yokogawa.LMS.Business.Service.Extensions
{
    public static class ServiceCollectionExtension
    {
        public static void RegisterServices(this IServiceCollection services)
        {
            services.AddScoped<IJettyService, JettyService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<ICustomerService, CustomerService>();
            services.AddScoped<IAgentService, AgentService>();
            services.AddScoped<IRFIDCardService, RFIDCardService>();
            services.AddScoped<ICarrierService, CarrierService>();
            services.AddScoped<IDriverService, DriverService>();
            services.AddScoped<IVesselService, VesselService>();
            services.AddScoped<ITankService, TankService>();
            services.AddScoped<ITruckService, TruckService>();
            services.AddScoped<ICompartmentService, CompartmentService>();
            services.AddScoped<IOdTruckLoadingJobService, OdTruckLoadingJobService>();
            services.AddScoped<IOdTruckLoadingOrderService, OdTruckLoadingOrderService>();
            services.AddScoped<ITruckUnloadingOrderService, TruckUnloadingOrderService>();
            services.AddScoped<IVesselDischargeOrder, VesselDischargeOrder>();
            services.AddScoped<IVesselLoadingOrderService, VesselLoadingOrderService>();
            services.AddScoped<IttOrderService, IttOrderService_Implement>();
        }
    }
}
