using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yokogawa.LMS.Exceptions;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.Security.OAuth.Identity;
using Yokogawa.LMS.Business.Service.Services.Interfaces.OperationData;
using Yokogawa.LMS.Business.Service.DTOs.OperationData;

namespace Yokogawa.LMS.Business.WebAPI
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OperationResultDataController : ControllerBase
    {
        IOperationResultDataService _operationResultDataService;
        IUserProfile Identity => this.HttpContext.User.GetUserAccount();
        public OperationResultDataController(IOperationResultDataService operationResultDataService)
        {
            _operationResultDataService = operationResultDataService;
        }

        [HttpGet]
        [Route("SaveTruckLoadingResultData")]
        public bool SaveTruckLoadingResultData(TruckLoadingResultData truckLoadingResultData)
        {
            return _operationResultDataService.SaveTruckLoadingResultData(truckLoadingResultData);
        }

        [HttpGet]
        [Route("SaveTruckUnloadingResultData")]
        public bool SaveTruckUnloadingResultData(TruckUnloadingResultData truckUnloadingResultData)
        {
            return _operationResultDataService.SaveTruckUnloadingResultData(truckUnloadingResultData);
        }

        [HttpGet]
        [Route("SaveVesselLoadingResultData")]
        public bool SaveVesselLoadingResultData(VesselLoadingResultData vesselLoadingResultData)
        {
            return _operationResultDataService.SaveVesselLoadingResultData(vesselLoadingResultData);
        }

        [HttpGet]
        [Route("SaveVesselDischargeResultData")]
        public bool SaveVesselDischargeResultData(VesselDischargeResultData vesselDischargeResultData)
        {
            return _operationResultDataService.SaveVesselDischargeResultData(vesselDischargeResultData);
        }

        [HttpGet]
        [Route("SavePipelineResultData")]
        public bool SavePipelineResultData(PipelineResultData pipelineResultData)
        {
            return _operationResultDataService.SavePipelineResultData(pipelineResultData);
        }

        [HttpGet]
        [Route("SaveITTResultData")]
        public bool SaveITTResultData(ITTResultData iTTResultData)
        {
            return _operationResultDataService.SaveITTResultData(iTTResultData);
        }
    }
}
