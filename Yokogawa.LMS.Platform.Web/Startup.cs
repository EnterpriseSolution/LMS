using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using System.Security.Authentication;
using System.Security.Claims;
using Yokogawa.LMS.Platform.Data;
using Yokogawa.LMS.Exceptions.CustomMiddlewares;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication;
using Microsoft.IdentityModel.Tokens;
using Yokogawa.Security.OAuth.Configuration;
using Yokogawa.LMS.Platform.Core.Services.Interfaces;
using Yokogawa.LMS.Platform.Core.Services;
using Yokogawa.LMS.Platform.Authentication;
using Yokogawa.Security.OAuth.Authentication;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Platform.Core.Extensions;
using Newtonsoft.Json.Serialization;

namespace Yokogawa.LMS.Platform.Web
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddTransient<ClaimsPrincipal>(s => s.GetService<IHttpContextAccessor>().HttpContext.User);
            // use real database
            services.AddDbContext<JoypadDBContext>(c =>
            c.UseSqlServer(Configuration.GetConnectionString("ConnectionString")));

            
            var _idpConfig = Configuration.GetSection(nameof(IdentityServerConfiguration)).Get<IdentityServerConfiguration>();
            var useOAuthServer = Convert.ToBoolean(Configuration.GetSection("UseOAuthServer").Value);
            services.AddSingleton(_idpConfig);
       
            services.RegisterServices();
            services.AddScoped<IClientService, ClientService>();

            services.AddControllers().AddNewtonsoftJson(options => {
                options.SerializerSettings.ContractResolver = new DefaultContractResolver();
                options.SerializerSettings.DateFormatString = "yyyy'-'MM'-'dd'T'HH':'mm':'ss.fffZ";
            });

            services.AddCors(confg => confg.AddPolicy("AllowAll",
              p => p.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader()));

            if (useOAuthServer)
            {
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
            }
            else {
                services.AddScoped<IOAuthAuthenticationService, OAuthAuthenticationService>();
                services.AddAuthentication("JWT").AddScheme<AuthenticationSchemeOptions, OAuthAuthenticationHandler>("JWT", null);
            }
               
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            /*if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }*/

            app.UseCors("AllowAll");


            //custom middleware for exception handling
            app.UseMiddleware<CustomExceptionMiddleware>();
            app.UseRouting();
            app.UseStaticFiles();

            app.UseAuthentication();
            app.UseAuthorization();
            
            var useOAuthServer = Convert.ToBoolean(Configuration.GetSection("UseOAuthServer").Value);
            if (!useOAuthServer)
                app.UseMiddleware<TokenProviderMiddleware>();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
