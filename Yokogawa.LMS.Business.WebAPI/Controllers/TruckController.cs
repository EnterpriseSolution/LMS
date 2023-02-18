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
namespace Yokogawa.LMS.Business.WebAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TruckController : ControllerBase
    {
        ITruckService _TruckService;
        IUserProfile Identity => this.HttpContext.User.GetUserAccount();
        public TruckController(ITruckService TruckService)
        {
            _TruckService = TruckService;
        }

        [HttpPost]
        [Route("Trucks")]
        public async Task<PagedCollection<TruckDto>> GetTrucks(BaseFilter filter)
        {
           var tmpTruck= await _TruckService.GetTrucks(filter);
            return tmpTruck;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetTruck(Guid id)
        {
            var Truck = await _TruckService.GetTruck(id);
            if (Truck == null)
                throw new NotFoundCustomException("Cannot find Truck");

            return Ok(Truck);
        }



        [HttpPost]
        [Route("SaveTruck")]
        public async Task<TruckDto> SaveTruck(TruckDto TruckDto)
        {
                return await _TruckService.SaveTruck(TruckDto, Identity);
        }


        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteTruck(Guid id)
        {
            await _TruckService.DeleteTruck(id, Identity);
            return Ok("Deleted");
        }
    }
}
