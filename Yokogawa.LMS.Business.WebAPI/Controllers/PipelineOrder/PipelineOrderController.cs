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
    public class PipelineOrderController : ControllerBase
    {
        IPipelineOrderService _pipelineOrderService;
        IUserProfile Identity => this.HttpContext.User.GetUserAccount();

        public PipelineOrderController(IPipelineOrderService pipelineOrderService)
        {
            _pipelineOrderService = pipelineOrderService;
        }

        [HttpPost]
        [Route("pipelineorders")]
        public async Task<PagedCollection<OdPipelineOrderDto>> GetPipelineOrders(BaseFilter filter)
        {
             return await _pipelineOrderService.GetPipelineOrders(filter);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetPipelineOrder(Guid id)
        {
            var pipelineOrderService = await _pipelineOrderService.GetPipelineOrder(id);
            if (pipelineOrderService == null)
                throw new NotFoundCustomException("Cannot find Pipeline Order");

            return Ok(pipelineOrderService);
        }

        [HttpPost]
        [Route("SavePipelineOrder")]
        public async Task<OdPipelineOrderDto> SavePipelineOrder(OdPipelineOrderDto pipelineOrder)
        {
            return await _pipelineOrderService.SavePipelineOrder(pipelineOrder, Identity);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeletePipelineOrder(Guid id)
        {          
            string result = "Deleted";
            try
            {
                await _pipelineOrderService.DeletePipelineOrder(id, Identity);
            }
            catch (Exception e)
            {
                result = e.Message;
            }

            return Ok(result);
        }
    }
}
