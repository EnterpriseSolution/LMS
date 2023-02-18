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
    public class DriverService : IDriverService
    {
        private LMSDBContext _dbContext;
        private readonly ILogger<DriverService> _logger;
        public DriverService(LMSDBContext dbContext, ILogger<DriverService> logger) 
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<PagedCollection<DriverDto>> GetDrivers(IFilter filter)
        {
            return await _dbContext.Drivers.ExcludeDeletion().AsNoTracking().GetQuery(filter)
                                           .Select<Driver, DriverDto>(DriverProjection.DriverDto)
                                           .ToPagedCollectionAsync(filter);

        }

        public async Task<DriverDto> GetDriver(Guid id)
        {
            DriverDto driver = id == Guid.Empty ? new DriverDto() { } : null;
            driver = driver ?? await _dbContext.Drivers.GetById(id).ExcludeDeletion().Select(DriverProjection.DriverDto).FirstOrDefaultAsync<DriverDto>();
            
            if (driver == null)
                throw new NotFoundCustomException("Record is not found");

            return driver;
        }

        public async Task<DriverDto> SaveDriver(DriverDto driverDto, IUserProfile profile)
        {
            var driver = await _dbContext.Drivers.CreateOrUpdateAsync(driverDto, profile);
            await _dbContext.SaveChangesAsync();
            driverDto.Id = driver.Id;
            return driverDto;
        }

        public async Task DeleteDriver(Guid id, IUserProfile user)
        {
            var result = await _dbContext.Drivers.DeleteAsync(id, user);
            if (result == null)
                return;

            await _dbContext.SaveChangesAsync();
        }
    }
}
 