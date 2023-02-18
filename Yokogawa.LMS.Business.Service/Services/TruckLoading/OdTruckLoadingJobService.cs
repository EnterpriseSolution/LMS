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
using Yokogawa.LMS.Business.Data;
using Yokogawa.LMS.Business.Data.Commands;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.LMS.Business.Service.Services.Interfaces.TruckLoading;
using Yokogawa.LMS.Business.Service.DTOs.TruckLoading;
using Yokogawa.LMS.Business.Data.Entities.TruckLoading;
using Yokogawa.LMS.Business.Service.Projections.TruckLoading;
using Yokogawa.LMS.Business.Data.Commands.TruckLoading;

namespace Yokogawa.LMS.Business.Service.Services.TruckLoading
{
   public class OdTruckLoadingJobService : IOdTruckLoadingJobService
    {
        private LMSDBContext _dbContext;
        private readonly ILogger<OdTruckLoadingJobService> _logger;
        public OdTruckLoadingJobService(LMSDBContext dbContext, ILogger<OdTruckLoadingJobService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<PagedCollection<OdTruckLoadingJobDto>> GetOdTruckLoadingJobs(IFilter filter)
        {
            return await _dbContext.OdTruckLoadingJobs.ExcludeDeletion().AsNoTracking().GetQuery(filter)
                                          .Select<OdTruckLoadingJob, OdTruckLoadingJobDto>(OdTruckLoadingJobProjection.OdTruckLoadingJobDto)
                                          .ToPagedCollectionAsync(filter);

        }

        public async Task<OdTruckLoadingJobDto> GetOdTruckLoadingJob(Guid id)
        {
            OdTruckLoadingJobDto OdTruckLoadingJob = id == Guid.Empty ? new OdTruckLoadingJobDto() { } : null;
            OdTruckLoadingJob = OdTruckLoadingJob ?? await _dbContext.OdTruckLoadingJobs.GetById(id).ExcludeDeletion().Select(OdTruckLoadingJobProjection.OdTruckLoadingJobDto).FirstOrDefaultAsync<OdTruckLoadingJobDto>();

            if (OdTruckLoadingJob == null)
                throw new NotFoundCustomException("Record is not found");

            return OdTruckLoadingJob;
        }

        public async Task<OdTruckLoadingJobDto> SaveOdTruckLoadingJob(OdTruckLoadingJobDto OdTruckLoadingJobDto, IUserProfile profile)
        {
            var OdTruckLoadingJob = await _dbContext.OdTruckLoadingJobs.CreateOrUpdateAsync(OdTruckLoadingJobDto, profile);
            await _dbContext.SaveChangesAsync();
            OdTruckLoadingJobDto.Id = OdTruckLoadingJob.Id;
            return OdTruckLoadingJobDto;
        }

        public async Task DeleteOdTruckLoadingJob(Guid id, IUserProfile user)
        {
            var result = await _dbContext.OdTruckLoadingJobs.DeleteAsync(id, user);
            if (result == null)
                return;

            await _dbContext.SaveChangesAsync();
        }
    }
}
