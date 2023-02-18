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

{   [AllowAnonymous]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OdTruckLoadingOrderChangeStatusController : ControllerBase
    {

        IOdTruckLoadingOrderService _OdTruckLoadingOrderService;
        IUserProfile Identity => this.HttpContext.User.GetUserAccount();
        public OdTruckLoadingOrderChangeStatusController(IOdTruckLoadingOrderService OdTruckLoadingOrderService)
        {
            _OdTruckLoadingOrderService = OdTruckLoadingOrderService;
        }

        [HttpPost]
        [Route("ChangeOrderStatus")]
        public async Task<OdTruckLoadingOrderDto> ChangeOdTruckLoadingOrder(OdTruckLoadingOrderDto OdTruckLoadingOrderDto)
        {
            return await _OdTruckLoadingOrderService.ChangeOdTruckLoadingOrderStatus(OdTruckLoadingOrderDto, Identity);

        }

    }
}
