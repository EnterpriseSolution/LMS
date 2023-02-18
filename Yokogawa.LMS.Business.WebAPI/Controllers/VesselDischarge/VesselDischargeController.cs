using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Business.Data.DTOs;
using Yokogawa.LMS.Business.Services.Interfaces;
using Yokogawa.LMS.Exceptions;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.Security.OAuth.Identity;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.LMS.Business.Service.DTOs;

namespace Yokogawa.LMS.Business.WebAPI
{
    [AllowAnonymous]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class VesselDischargeController : ControllerBase
    {
        IVesselDischargeOrder _vesselDischargeOrderService;
        IUserProfile Identity => this.HttpContext.User.GetUserAccount();

        public VesselDischargeController(IVesselDischargeOrder driverService)
        {
            _vesselDischargeOrderService = driverService;
        }

        [HttpPost]
        [Route("vesseldischargeorders")]
        public async Task<PagedCollection<VesselDischargeOrderDto>> GetVesselDischargeOrders(BaseFilter filter)
        {
             return await _vesselDischargeOrderService.GetVesselDischargeOrders(filter);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetVesselDischarge(Guid id)
        {
            var vesselDischarge = await _vesselDischargeOrderService.GetVesselDischargeOrder(id);
            if (vesselDischarge == null)
                throw new NotFoundCustomException("Cannot find Vessel Discharge");

            return Ok(vesselDischarge);
        }



        [HttpPost]
        [Route("SaveVesselDischargeOrder")]
        public async Task<VesselDischargeOrderDto> SaveVesselDischargeOrder(VesselDischargeOrderDto vesselDischargeOrderDto)
        {
            return await _vesselDischargeOrderService.SaveVesselDischargeOrder(vesselDischargeOrderDto, Identity);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteVesselDischargeOrder(Guid id)
        {          
            string result = "Deleted";
            try
            {
                await _vesselDischargeOrderService.DeleteVesselDischargeOrder(id, Identity);
            }
            catch (Exception e)
            {
                result = e.Message;
            }

            return Ok(result);
        }
    }
}
