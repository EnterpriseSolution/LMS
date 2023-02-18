using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OfficeOpenXml.FormulaParsing.Excel.Functions;
using Yokogawa.Data.Infrastructure.DTOs.Base;
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
    public class TankController : ControllerBase
    {
        ITankService _tankService;
        IUserProfile Identity => this.HttpContext.User.GetUserAccount();

        public TankController(ITankService tankService)
        {
            _tankService = tankService;
        }

        [HttpPost]
        [Route("tanks")]
        public async Task<PagedCollection<TankDto>> GetTanks(BaseFilter filter)
        {          
            return await _tankService.GetTanks(filter);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetTank(Guid id)
        {
            var tank = await _tankService.GetTank(id);          
            tank.AllowEdit = id.Equals(Guid.Empty);
            return Ok(tank);
        }

        [HttpGet]
        [Route("[action]/{tankNo}")]
        public  bool Check(string tankNo)
        {
            return _tankService.CheckTank(tankNo);                       
        }

        [HttpPost]
        [Route("SaveTank")]
        public async Task<TankDto> SaveTank(TankDto tankDto)
        {
            return await _tankService.SaveTank(tankDto, Identity);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteTank(Guid id)
        {
            string result = "Deleted";
            try
            {
                await _tankService.DeleteTank(id, Identity);
            }
            catch (Exception e)
            {
                result = e.Message;
            }
            
            return Ok(result);
        }
    }
}
