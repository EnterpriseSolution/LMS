using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.LMS.Business.Service.DTOs.TruckLoading;

namespace Yokogawa.LMS.Business.Service.Services.Interfaces.TruckLoading
{
    public interface IOdTruckLoadingJobService
    {
        Task<PagedCollection<OdTruckLoadingJobDto>> GetOdTruckLoadingJobs(IFilter filter);
        Task<OdTruckLoadingJobDto> GetOdTruckLoadingJob(Guid id);
        Task<OdTruckLoadingJobDto> SaveOdTruckLoadingJob(OdTruckLoadingJobDto jetty, IUserProfile user);
        Task DeleteOdTruckLoadingJob(Guid id, IUserProfile user);
    }
}
