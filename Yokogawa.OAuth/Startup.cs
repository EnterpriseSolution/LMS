using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Yokogawa.LMS.Platform.Data;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Exceptions.CustomMiddlewares;
using Microsoft.AspNetCore.Authentication;
using Yokogawa.Security.OAuth.Authentication;
using Yokogawa.Data.Infrastructure.Extensions;
using Yokogawa.LMS.Platform.Authentication;
using Yokogawa.Security.OAuth.Authorization;
using Microsoft.AspNetCore.Authorization;
using Yokogawa.Security.OAuth.Configuration;

namespace Yokogawa.OAuth
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddTransient<IHttpContextAccessor, HttpContextAccessor>();
            services.AddTransient<ClaimsPrincipal>(
             s => s.GetService<IHttpContextAccessor>().HttpContext.User);

            // use real database
            services.AddDbContext<JoypadDBContext>(c => c.UseSqlServer(Configuration.GetConnectionString("ConnectionString")));
            //get configuration
            var config = Configuration.GetSection("AzureAd");
            if (config.Exists()) {
                services.Configure<AzureAdOptions>(config);
                services.AddHttpClient();
            }
            
            services.AddScoped<IOAuthAuthenticationService, OAuthAuthenticationService>();
            //services.AddScoped<IAPIPermissionService, OAuthAuthenticationService>();
            services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new UTCDateTimeConverter());
            });

            
            // configure basic authentication 
            services.AddAuthentication("JWT").AddScheme<AuthenticationSchemeOptions, OAuthAuthenticationHandler>("JWT", null);

            services.AddAuthorization(options => options.AddPolicy("APIPermssion",
                  policy => {
                      Guid applicationId = new Guid("11111111-1111-1111-1111-111111111111");
                      policy.Requirements.Add(new PermissionRequirement(applicationId,true));
                  }));

            services.AddCors(confg => confg.AddPolicy("AllowAll", p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

            services.AddScoped<IAuthorizationHandler, APIPermssionHandler>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            /*if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }*/

            app.UseCors("AllowAll");
            //Sample of using custom middleware  for exception handling
            app.UseMiddleware<CustomExceptionMiddleware>();

            app.UseHttpsRedirection();
            app.UseRouting();

            app.UseAuthentication();
            app.UseMiddleware<TokenProviderMiddleware>();
            app.UseAuthorization();
            

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
