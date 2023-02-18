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
    public class CustomerController : ControllerBase
    {
        ICustomerService _customerService;
        IUserProfile Identity => this.HttpContext.User.GetUserAccount();
        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpPost]
        [Route("customers")]
        public async Task<PagedCollection<CustomerDto>> GetCustomers(BaseFilter filter)
        {
            return await _customerService.GetCustomers(filter);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetCustomer(Guid id)
        {
            var customer = await _customerService.GetCustomer(id);
            if (customer == null)
                throw new NotFoundCustomException("Cannot find customer");

            return Ok(customer);
        }

        [HttpPost]
        [Route("SaveCustomer")]
        public async Task<CustomerDto> SaveCustomer(CustomerDto customerDto)
        {
            return await _customerService.SaveCustomer(customerDto, Identity);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteCustomer(Guid id)
        {
            await _customerService.DeleteCustomer(id, Identity);
            return Ok("Deleted");
        }
    }
}
