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
using Yokogawa.LMS.Business.Service.Services.Interfaces.TruckUnloading;
using Yokogawa.LMS.Business.Service.DTOs.TruckUnloading;
using Yokogawa.LMS.Business.Data.Enums;

namespace Yokogawa.LMS.Business.WebAPI.Controllers.TruckUnloading
{
    [AllowAnonymous]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OdTruckUnloadingOrderChangeStatusController : ControllerBase
    {
        private ITruckUnloadingOrderService _odTruckUnLoadingOrderService;        

        public OdTruckUnloadingOrderChangeStatusController(ITruckUnloadingOrderService odTruckUnLoadingOrderService)
        {
            _odTruckUnLoadingOrderService = odTruckUnLoadingOrderService;
        }       

        [HttpGet]
        [Route("ChangeOrderStatus")]
        public bool ChangeOrderStatus(string orderNo,int status)
        {
            return  _odTruckUnLoadingOrderService.ChangeOrderStatus(orderNo, status);           
        }
    }
}
