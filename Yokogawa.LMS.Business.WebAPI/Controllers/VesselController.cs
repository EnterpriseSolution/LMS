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
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.Data.Infrastructure.DTOs;

namespace Yokogawa.LMS.Business.WebAPI
{
    [AllowAnonymous]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class VesselController : ControllerBase
    {
        IVesselService _vesselService;
        IUserProfile Identity => this.HttpContext.User.GetUserAccount();
        public VesselController(IVesselService vesselService)
        {
            _vesselService = vesselService;
        }

        [HttpPost]
        [Route("vessels")]
        public async Task<PagedCollection<VesselDto>> GetVessels(BaseFilter filter)
        {
            return await _vesselService.GetVessels(filter);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetVessel(Guid id)
        {
            var vessel = await _vesselService.GetVessel(id);
            vessel.AllowEdit = id.Equals(Guid.Empty);
            return Ok(vessel);
        }

        [HttpGet]
        [Route("[action]/{vesselName}")]
        public bool Check(string vesselName)
        {
            return _vesselService.CheckVessel(vesselName);
        }

        [HttpPost]
        [Route("SaveVessel")]
        public async Task<VesselDto> SaveVessel(VesselDto vesselDto)
        {
            return await _vesselService.SaveVessel(vesselDto, Identity);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteVessel(Guid id)
        {         
            string result = "Deleted";
            try
            {
                await _vesselService.DeleteVessel(id, Identity);
            }
            catch (Exception e)
            {
                result = e.Message;
            }

            return Ok(result);
        }
    }
}
