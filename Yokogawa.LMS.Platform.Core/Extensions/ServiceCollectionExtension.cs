using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Yokogawa.LMS.Platform.Core.Services;
using Yokogawa.LMS.Platform.Core.Services.Interfaces;
using Yokogawa.Data.Infrastructure.Services;

namespace Yokogawa.LMS.Platform.Core.Extensions
{
    public static class ServiceCollectionExtension
    {
        public static void RegisterServices(this IServiceCollection services)
        {
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<IDashboardService, DashboardService>();
            services.AddScoped<IMenuService, MenuService>();
            services.AddScoped<IPageService, PageService>();
            services.AddScoped<IWidgetService, WidgetService>();
            services.AddScoped<IWebsiteService, WebsiteService>();
            services.AddScoped<IDocumentService, DocumentService>();
            services.AddScoped<IAuditTrailService, AuditTrailService>();
        }
    }
}
