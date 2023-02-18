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
    public class CustomerService : ICustomerService
    {
        private LMSDBContext _dbContext;
        private readonly ILogger<CustomerService> _logger;
        public CustomerService(LMSDBContext dbContext, ILogger<CustomerService> logger) 
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<PagedCollection<CustomerDto>> GetCustomers(IFilter filter)
        {
            return await _dbContext.Customers.ExcludeDeletion().AsNoTracking().GetQuery(filter)
                                             .Select<Customer, CustomerDto>(CustomerProjection.CustomerDto)
                                             .ToPagedCollectionAsync(filter);
        }

        public async Task<CustomerDto> GetCustomer(Guid id)
        {
            CustomerDto customer = id == Guid.Empty ? new CustomerDto() { } : null;
            customer = customer ?? await _dbContext.Customers.GetById(id).ExcludeDeletion().Select(CustomerProjection.CustomerDto).FirstOrDefaultAsync<CustomerDto>();
            
            if (customer == null)
                throw new NotFoundCustomException("Record is not found");

            return customer;
        }

        public async Task<CustomerDto> SaveCustomer(CustomerDto customerDto, IUserProfile profile)
        {
            var customer = await _dbContext.Customers.CreateOrUpdateAsync(customerDto, profile);
            await _dbContext.SaveChangesAsync();
            customerDto.Id = customer.Id;
            return customerDto;
        }

        public async Task DeleteCustomer(Guid id, IUserProfile user)
        {
            var result = await _dbContext.Customers.DeleteAsync(id, user);
            if (result == null)
                return;

            await _dbContext.SaveChangesAsync();
        }
    }
}
 