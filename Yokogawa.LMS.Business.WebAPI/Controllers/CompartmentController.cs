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
    public class CompartmentController : ControllerBase
    {
        ICompartmentService _CompartmentService;
        IUserProfile Identity => this.HttpContext.User.GetUserAccount();
        public CompartmentController(ICompartmentService CompartmentService)
        {
            _CompartmentService = CompartmentService;
        }

        [HttpPost]
        [Route("Compartments")]
        public async Task<PagedCollection<CompartmentDto>> GetCompartments(BaseFilter filter)
        {
            return await _CompartmentService.GetCompartments(filter);
        }

        [HttpGet]
        [Route("GetCompartmentsByTruckId/{truckId}")]
        public async Task<List<CompartmentDto>> GetCompartmentsByTruckId(String truckId)
        {
            return await _CompartmentService.GetCompartmentsByTruckId(truckId);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetCompartment(Guid id)
        {
            var Compartment = await _CompartmentService.GetCompartment(id);
            if (Compartment == null)
                throw new NotFoundCustomException("Cannot find Compartment");

            return Ok(Compartment);
        }



        [HttpPost]
        [Route("SaveCompartment")]
        public async Task<CompartmentDto> SaveCompartment(CompartmentDto CompartmentDto)
        {
            return await _CompartmentService.SaveCompartment(CompartmentDto, Identity);
        }


        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteCompartment(Guid id)
        {
            await _CompartmentService.DeleteCompartment(id, Identity);
            return Ok("Deleted");
        }
    }
}
