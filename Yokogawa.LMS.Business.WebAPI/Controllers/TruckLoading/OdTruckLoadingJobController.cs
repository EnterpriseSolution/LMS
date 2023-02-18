using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Exceptions;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.Security.OAuth.Identity;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.LMS.Business.Service.Services.Interfaces.TruckLoading;
using Yokogawa.LMS.Business.Service.DTOs.TruckLoading;

namespace Yokogawa.LMS.Business.WebAPI.Controllers.TruckLoading
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OdTruckLoadingJobController : ControllerBase
    {
        IOdTruckLoadingJobService _OdTruckLoadingJobService;
        IUserProfile Identity => this.HttpContext.User.GetUserAccount();
        public OdTruckLoadingJobController(IOdTruckLoadingJobService OdTruckLoadingJobService)
        {
            _OdTruckLoadingJobService = OdTruckLoadingJobService;
        }

        [HttpPost]
        [Route("OdTruckLoadingJobs")]
        public async Task<PagedCollection<OdTruckLoadingJobDto>> GetOdTruckLoadingJobs(BaseFilter filter)
        {
            return await _OdTruckLoadingJobService.GetOdTruckLoadingJobs(filter);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetOdTruckLoadingJob(Guid id)
        {
            var OdTruckLoadingJob = await _OdTruckLoadingJobService.GetOdTruckLoadingJob(id);
            if (OdTruckLoadingJob == null)
                throw new NotFoundCustomException("Cannot find OdTruckLoadingJob");

            return Ok(OdTruckLoadingJob);
        }



        [HttpPost]
        [Route("SaveOdTruckLoadingJob")]
        public async Task<OdTruckLoadingJobDto> SaveOdTruckLoadingJob(OdTruckLoadingJobDto OdTruckLoadingJobDto)
        {
            return await _OdTruckLoadingJobService.SaveOdTruckLoadingJob(OdTruckLoadingJobDto, Identity);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteOdTruckLoadingJob(Guid id)
        {
            await _OdTruckLoadingJobService.DeleteOdTruckLoadingJob(id, Identity);
            return Ok("Deleted");
        }
    }
}
