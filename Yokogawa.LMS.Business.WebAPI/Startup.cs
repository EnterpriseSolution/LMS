using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;
using Yokogawa.LMS.Business.Data;
using Yokogawa.LMS.Business.Service.Extensions;
using Yokogawa.Security.OAuth.Configuration;
using Yokogawa.LMS.Exceptions.CustomMiddlewares;
using Microsoft.OpenApi.Models;

namespace Yokogawa.LMS.Business.WebAPI
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
            services.AddTransient<ClaimsPrincipal>(s => s.GetService<IHttpContextAccessor>().HttpContext.User);
            // use real database
            services.AddDbContext<LMSDBContext>(c =>
            c.UseSqlServer(Configuration.GetConnectionString("ConnectionString")));


            var _idpConfig = Configuration.GetSection(nameof(IdentityServerConfiguration)).Get<IdentityServerConfiguration>();
            var useOAuthServer = Convert.ToBoolean(Configuration.GetSection("UseOAuthServer").Value);
            services.AddSingleton(_idpConfig);

            services.RegisterServices();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "API Demo", Version = "v1" });
            });

            services.AddControllers().AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ContractResolver = new DefaultContractResolver();
                options.SerializerSettings.DateFormatString = "yyyy'-'MM'-'dd'T'HH':'mm':'ssZ";
            });

            services.AddCors(confg => confg.AddPolicy("AllowAll",
              p => p.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader()));


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

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors("AllowAll");


            //custom middleware for exception handling
            app.UseMiddleware<CustomExceptionMiddleware>();

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "API Demo v1");
            });

            app.UseRouting();
            app.UseStaticFiles();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
