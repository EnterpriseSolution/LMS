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
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CarrierController : ControllerBase
    {
        ICarrierService _carrierService;
        IUserProfile Identity => this.HttpContext.User.GetUserAccount();
        public CarrierController(ICarrierService carrierService)
        {
            _carrierService = carrierService;
        }

        [HttpPost]
        [Route("carriers")]
        public async Task<PagedCollection<CarrierDto>> GetCarriers(BaseFilter filter)
        {
            return await _carrierService.GetCarriers(filter);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetCarrier(Guid id)
        {
            var carrier = await _carrierService.GetCarrier(id);
            if (carrier == null)
                throw new NotFoundCustomException("Cannot find Carrier");

            return Ok(carrier);
        }



        [HttpPost]
        [Route("SaveCarrier")]
        public async Task<CarrierDto> SaveCarrier(CarrierDto carrierDto)
        {
            return await _carrierService.SaveCarrier(carrierDto, Identity);
        }


        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteCarrier(Guid id)
        {
            await _carrierService.DeleteCarrier(id, Identity);
            return Ok("Deleted");
        }
    }
}
