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
using Yokogawa.LMS.Business.Service.Services.Interfaces.IttOrder;
using Yokogawa.LMS.Business.Service.DTOs.IttOrder;

namespace Yokogawa.LMS.Business.WebAPI.Controllers.IttOrderController
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class IttOrderController : ControllerBase
    {
        IttOrderService _IttOrderService;
        IUserProfile Identity => this.HttpContext.User.GetUserAccount();
        public IttOrderController(IttOrderService IttOrderService)
        {
            _IttOrderService = IttOrderService;
        }

        [HttpPost]
        [Route("IttOrders")]
        public async Task<PagedCollection<IttOrderDto>> GetIttOrders(BaseFilter filter)
        {
            return await _IttOrderService.GetIttOrders(filter);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetIttOrder(Guid id)
        {
            var IttOrder = await _IttOrderService.GetIttOrder(id);
            if (IttOrder == null)
                throw new NotFoundCustomException("Cannot find IttOrder");

            return Ok(IttOrder);
        }

        [HttpGet]
        [Route("[action]")]
        public IttOrderMasterData GetMasterData()
        {
            return _IttOrderService.GetMasterData();
        }


        [HttpPost]
        [Route("SaveIttOrder")]
        public async Task<IttOrderDto> SaveIttOrder(IttOrderDto IttOrderDto)
        {
            return await _IttOrderService.SaveIttOrder(IttOrderDto, Identity);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteIttOrder(Guid id)
        {
            await _IttOrderService.DeleteIttOrder(id, Identity);
            return Ok("Deleted");
        }

    }
}
