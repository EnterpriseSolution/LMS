using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Exceptions;
using Yokogawa.LMS.Business.Services.Interfaces;
using Yokogawa.LMS.Business.Data;
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.LMS.Business.Data.Entities;
using Yokogawa.LMS.Business.Service.Projections;
using Yokogawa.LMS.Business.Data.Commands;
using Yokogawa.Data.Infrastructure.DTOs;

namespace Yokogawa.LMS.Business.Services
{
    public class ProductService : IProductService
    {
        private LMSDBContext _dbContext;
        private readonly ILogger<ProductService> _logger;
        public ProductService(LMSDBContext dbContext, ILogger<ProductService> logger) 
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<PagedCollection<ProductDto>> GetProducts(IFilter filter)
        {
            return await _dbContext.Products.ExcludeDeletion().AsNoTracking().GetQuery(filter)
                                            .Select<Product, ProductDto>(ProductProjection.ProductDto)
                                            .ToPagedCollectionAsync(filter);

        }

        public async Task<ProductDto> GetProduct(Guid id)
        {
            ProductDto product = id == Guid.Empty ? new ProductDto() { } : null;
            product = product ?? await _dbContext.Products.GetById(id).ExcludeDeletion().Select(ProductProjection.ProductDto).FirstOrDefaultAsync<ProductDto>();
            
            if (product == null)
                throw new NotFoundCustomException("Record is not found");

            return product;
        }

        public async Task<ProductDto> SaveProduct(ProductDto productDto, IUserProfile profile)
        {
            var product = await _dbContext.Products.CreateOrUpdateAsync(productDto, profile);
            await _dbContext.SaveChangesAsync();
            productDto.Id = product.Id;
            return productDto;
        }

        public async Task DeleteProduct(Guid id, IUserProfile user)
        {
            var result = await _dbContext.Products.DeleteAsync(id, user);
            if (result == null)
                return;

            await _dbContext.SaveChangesAsync();
        }
    }
}
 