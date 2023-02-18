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
using Yokogawa.LMS.Business.Service.Services.Interfaces.VesselLoadingOrder;
using Yokogawa.LMS.Business.Service.DTOs.VesselLoadingOrder;

namespace Yokogawa.LMS.Business.WebAPI.Controllers.VesselLoadingOrder
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class VesselLoadingOrderController : ControllerBase
    {
        IVesselLoadingOrderService _VesselLoadingOrderService;
        IUserProfile Identity => this.HttpContext.User.GetUserAccount();
        public VesselLoadingOrderController(IVesselLoadingOrderService VesselLoadingOrderService)
        {
            _VesselLoadingOrderService = VesselLoadingOrderService;
        }

        [HttpPost]
        [Route("VesselLoadingOrders")]
        public async Task<PagedCollection<VesselLoadingOrderDto>> GetVesselLoadingOrders(BaseFilter filter)
        {
            return await _VesselLoadingOrderService.GetVesselLoadingOrders(filter);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetVesselLoadingOrder(Guid id)
        {
            var VesselLoadingOrder = await _VesselLoadingOrderService.GetVesselLoadingOrder(id);
            if (VesselLoadingOrder == null)
                throw new NotFoundCustomException("Cannot find VesselLoadingOrder");

            return Ok(VesselLoadingOrder);
        }

        [HttpGet]
        [Route("[action]")]
        public VesselLoadingOrderMasterData GetMasterData()
        {
            return _VesselLoadingOrderService.GetMasterData();
        }


        [HttpPost]
        [Route("SaveVesselLoadingOrder")]
        public async Task<VesselLoadingOrderDto> SaveVesselLoadingOrder(VesselLoadingOrderDto VesselLoadingOrderDto)
        {
            return await _VesselLoadingOrderService.SaveVesselLoadingOrder(VesselLoadingOrderDto, Identity);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteVesselLoadingOrder(Guid id)
        {
            await _VesselLoadingOrderService.DeleteVesselLoadingOrder(id, Identity);
            return Ok("Deleted");
        }
    }
}
