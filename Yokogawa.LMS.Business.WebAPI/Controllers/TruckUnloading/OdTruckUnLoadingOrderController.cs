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
using Yokogawa.LMS.Business.Service.Services.Interfaces.TruckUnloading;
using Yokogawa.LMS.Business.Service.DTOs.TruckUnloading;
using Yokogawa.LMS.Business.Data.Enums;

namespace Yokogawa.LMS.Business.WebAPI.Controllers.TruckLoading
{
    [AllowAnonymous]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OdTruckUnLoadingOrderController : ControllerBase
    {
        private ITruckUnloadingOrderService _odTruckUnLoadingOrderService;
        private IUserProfile Identity => this.HttpContext.User.GetUserAccount();

        public OdTruckUnLoadingOrderController(ITruckUnloadingOrderService odTruckUnLoadingOrderService)
        {
            _odTruckUnLoadingOrderService = odTruckUnLoadingOrderService;
        }

        [HttpPost]
        [Route("OdTruckUnLoadingOrders")]
        public async Task<PagedCollection<OdTruckUnloadingOrderDto>> GetOdTruckUnLoadingOrders(BaseFilter filter)
        {
            return await _odTruckUnLoadingOrderService.GetOdTruckUnLoadingOrders(filter);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetOdTruckUnLoadingOrder(Guid id)
        {
            var odTruckUnLoadingOrder = await _odTruckUnLoadingOrderService.GetOdTruckUnLoadingOrder(id);
            odTruckUnLoadingOrder.AllowEdit = id.Equals(Guid.Empty);
            return Ok(odTruckUnLoadingOrder);
        }


        [HttpPost]
        [Route("SaveOdTruckUnLoadingOrder")]
        public async Task<OdTruckUnloadingOrderDto> SaveOdTruckUnLoadingOrder(OdTruckUnloadingOrderDto OdTruckLoadingOrderDto)
        {
            OdTruckLoadingOrderDto.Status = 1;
            OdTruckLoadingOrderDto.SourceType = (int)EnumOrderSourceTypeStatus.Manual;
            return await _odTruckUnLoadingOrderService.SaveOdTruckUnLoadingOrder(OdTruckLoadingOrderDto, Identity);
        }

        [HttpGet]
        [Route("[action]/{orderNo}")]
        public bool Check(string orderNo)
        {
            return _odTruckUnLoadingOrderService.CheckOrderExist(orderNo);
        }

        [HttpGet]
        [Route("[action]")]
        public TruckUnloadingOrderMasterData GetMasterData()
        {
            return _odTruckUnLoadingOrderService.GetMasterData();
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteOdTruckUnLoadingOrder(Guid id)
        {
            string result = "Deleted";
            try
            {
                await _odTruckUnLoadingOrderService.DeleteOdTruckUnLoadingOrder(id, Identity);
            }
            catch (Exception e)
            {
                result = e.Message;
            }

            return Ok(result);
        }
    }
}
