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
    public class OdTruckLoadingOrderController : ControllerBase
    {
        IOdTruckLoadingOrderService _OdTruckLoadingOrderService;
        IUserProfile Identity => this.HttpContext.User.GetUserAccount();
        public OdTruckLoadingOrderController(IOdTruckLoadingOrderService OdTruckLoadingOrderService)
        {
            _OdTruckLoadingOrderService = OdTruckLoadingOrderService;
        }

        [HttpPost]
        [Route("OdTruckLoadingOrders")]
        public async Task<PagedCollection<OdTruckLoadingOrderDto>> GetOdTruckLoadingOrders(BaseFilter filter)
        {
            return await _OdTruckLoadingOrderService.GetOdTruckLoadingOrders(filter);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetOdTruckLoadingOrder(Guid id)
        {
            var OdTruckLoadingOrder = await _OdTruckLoadingOrderService.GetOdTruckLoadingOrder(id);
            if (OdTruckLoadingOrder == null)
                throw new NotFoundCustomException("Cannot find OdTruckLoadingOrder");

            return Ok(OdTruckLoadingOrder);
        }


        [HttpPost]
        [Route("SaveOdTruckLoadingOrder")]
        public async Task<OdTruckLoadingOrderDto> SaveOdTruckLoadingOrder(OdTruckLoadingOrderDto OdTruckLoadingOrderDto)
        {
            return await _OdTruckLoadingOrderService.SaveOdTruckLoadingOrder(OdTruckLoadingOrderDto, Identity);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteOdTruckLoadingOrder(Guid id)
        {
            await _OdTruckLoadingOrderService.DeleteOdTruckLoadingOrder(id, Identity);
            return Ok("Deleted");
        }

     

    }
}
