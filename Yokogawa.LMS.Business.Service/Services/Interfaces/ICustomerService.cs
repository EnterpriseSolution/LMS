using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.Data.Infrastructure.DTOs;

namespace Yokogawa.LMS.Business.Services.Interfaces
{
    public interface ICustomerService
    {
        Task<PagedCollection<CustomerDto>> GetCustomers(IFilter filter);
        Task<CustomerDto> GetCustomer(Guid id);
        Task<CustomerDto> SaveCustomer(CustomerDto jetty, IUserProfile user);
        Task DeleteCustomer(Guid id, IUserProfile user);
    }
}
