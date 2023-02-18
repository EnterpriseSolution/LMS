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
    public class DriverController : ControllerBase
    {
        IDriverService _driverService;
        IUserProfile Identity => this.HttpContext.User.GetUserAccount();
        public DriverController(IDriverService driverService)
        {
            _driverService = driverService;
        }

        [HttpPost]
        [Route("drivers")]
        public async Task<PagedCollection<DriverDto>> GetDrivers(BaseFilter filter)
        {
             return await _driverService.GetDrivers(filter);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetDriver(Guid id)
        {
            var driver = await _driverService.GetDriver(id);
            if (driver == null)
                throw new NotFoundCustomException("Cannot find Driver");

            return Ok(driver);
        }



        [HttpPost]
        [Route("SaveDriver")]
        public async Task<DriverDto> SaveDriver(DriverDto driverDto)
        {
            return await _driverService.SaveDriver(driverDto, Identity);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteDriver(Guid id)
        {
            await _driverService.DeleteDriver(id, Identity);
            return Ok("Deleted");
        }
    }
}
