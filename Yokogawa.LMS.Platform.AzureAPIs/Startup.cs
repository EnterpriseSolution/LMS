using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Yokogawa.Security.OAuth.Configuration;
using Yokogawa.Security.OAuth.Identity;
using Yokogawa.Security.OAuth.MSGraph;
using Microsoft.Graph;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;

namespace Yokogawa.LMS.Platform.AzureAPIs
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
            services.AddControllers();

            var _idpConfig = Configuration.GetSection(nameof(IdentityServerConfiguration)).Get<IdentityServerConfiguration>();
            services.AddSingleton(_idpConfig);

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKeys = _idpConfig.keys,
                    ValidateIssuer = _idpConfig.ValidateIssuer,
                    ValidIssuer = _idpConfig.Issuer,
                    ValidateAudience = true,
                    ValidAudiences = _idpConfig.Audiences,
                    ValidateLifetime = true,

                };
            });

            services.Configure<AzureAdOptions>(Configuration.GetSection("AzureAd"));
            services.AddSingleton<IConfidentialClientService, ConfidentialClientService>();
            services.AddScoped<IAuthenticationProvider, ClientCredentialMsGraphAuthenticationProvider>();
            services.AddScoped<IGraphApiService, GraphApiService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
