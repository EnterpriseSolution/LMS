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
    public class CarrierService : ICarrierService
    {
        private LMSDBContext _dbContext;
        private readonly ILogger<CarrierService> _logger;
        public CarrierService(LMSDBContext dbContext, ILogger<CarrierService> logger) 
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<PagedCollection<CarrierDto>> GetCarriers(IFilter filter)
        {
           
            return await _dbContext.Carriers.ExcludeDeletion().AsNoTracking().GetQuery(filter)
                                            .Select<Carrier, CarrierDto>(CarrierProjection.CarrierDto)
                                            .ToPagedCollectionAsync(filter);

        }

        public async Task<CarrierDto> GetCarrier(Guid id)
        {
            CarrierDto carrier = id == Guid.Empty ? new CarrierDto() { } : null;
            carrier = carrier ?? await _dbContext.Carriers.GetById(id).ExcludeDeletion().Select(CarrierProjection.CarrierDto).FirstOrDefaultAsync<CarrierDto>();
            
            if (carrier == null)
                throw new NotFoundCustomException("Record is not found");

            return carrier;
        }

        public async Task<CarrierDto> SaveCarrier(CarrierDto cardDto, IUserProfile profile)
        {
            var carrier = await _dbContext.Carriers.CreateOrUpdateAsync(cardDto, profile);
            await _dbContext.SaveChangesAsync();
            cardDto.Id = carrier.Id;
            return cardDto;
        }

        public async Task DeleteCarrier(Guid id, IUserProfile user)
        {
            var result = await _dbContext.Carriers.DeleteAsync(id, user);
            if (result == null)
                return;

            await _dbContext.SaveChangesAsync();
        }
    }
}
 