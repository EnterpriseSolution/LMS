using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Exceptions;
using Yokogawa.LMS.Business.Services.Interfaces;
using Yokogawa.LMS.Business.Data;
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.LMS.Business.Data.Entities;
using Yokogawa.LMS.Business.Service.Projections;
using Yokogawa.LMS.Business.Data.Commands;
using Yokogawa.Data.Infrastructure.DTOs;

namespace Yokogawa.LMS.Business.Services
{
    public class JettyService : IJettyService
    {
        private LMSDBContext _dbContext;

        private readonly ILogger<JettyService> _logger;
        public JettyService(LMSDBContext dbContext, ILogger<JettyService> logger) 
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<PagedCollection<JettyDto>> GetJetties(IFilter filter)
        {
          
           var jetties = await _dbContext.Jetties.ExcludeDeletion().AsNoTracking().GetQuery(filter).Select<Jetty,JettyDto>(JettyProjection.JettyDto). ToPagedCollectionAsync(filter) ;
           

            return jetties;
        }

        public async Task<JettyDto> GetJetty(Guid id)
        {
            JettyDto jetty = id == Guid.Empty ? new JettyDto() : null;
            jetty = jetty ?? await _dbContext.Jetties.GetById(id).AsNoTracking().Select<Jetty,JettyDto>(JettyProjection.JettyDto).FirstOrDefaultAsync();
            
            if (jetty == null)
                throw new NotFoundCustomException("Record is not found");

            return jetty;
        }

        public async Task<JettyDto> SaveJetty(JettyDto jettyDto, IUserProfile profile)
        {
            var jetty = await _dbContext.Jetties.CreateOrUpdateAsync(jettyDto, profile);
            await _dbContext.SaveChangesAsync();
            jettyDto.Id = jetty.Id;
            return jettyDto;
        }

        public async Task DeleteJetty(Guid id, IUserProfile user)
        {
            var result = await _dbContext.Jetties.DeleteAsync(id, user);
            if (result == null)
                return;

            await _dbContext.SaveChangesAsync();
        }

      
    }
}
 