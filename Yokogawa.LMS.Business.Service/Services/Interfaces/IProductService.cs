using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.Data.Infrastructure.DTOs;

namespace Yokogawa.LMS.Business.Services.Interfaces
{
    public interface IProductService
    {
        Task<PagedCollection<ProductDto>> GetProducts(IFilter filter);
        Task<ProductDto> GetProduct(Guid id);
        Task<ProductDto> SaveProduct(ProductDto product, IUserProfile user);
        Task DeleteProduct(Guid id, IUserProfile user);
    }
}
