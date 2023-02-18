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
    public class ProductController : ControllerBase
    {
        IProductService _productService;
        IUserProfile Identity => this.HttpContext.User.GetUserAccount();
        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpPost]
        [Route("products")]
        public async Task<PagedCollection<ProductDto>> GetProducts(BaseFilter filter)
        {
           
            return await _productService.GetProducts(filter);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetProduct(Guid id)
        {
            var product = await _productService.GetProduct(id);
            if (product == null)
                throw new NotFoundCustomException("Cannot find product");

            return Ok(product);
        }


        [HttpPost]
        [Route("SaveProduct")]
        public async Task<ProductDto> SaveProduct(ProductDto productDto)
        {
            return await _productService.SaveProduct(productDto, Identity);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            await _productService.DeleteProduct(id, Identity);
            return Ok("Deleted");
        }
    }
}
