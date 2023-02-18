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
    public class TruckService : ITruckService
    {
        private LMSDBContext _dbContext;
        private readonly ILogger<TruckService> _logger;
        public TruckService(LMSDBContext dbContext, ILogger<TruckService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<PagedCollection<TruckDto>> GetTrucks(IFilter filter)
        {
            var tmpTruckDto = await _dbContext.Trucks.Include(p => p.Compartments).ExcludeDeletion().AsNoTracking().GetQuery(filter)
                                             .Select<Truck, TruckDto>(TruckProjection.TruckListDto)
                                             .ToPagedCollectionAsync(filter);
            return tmpTruckDto;

        }

        public async Task<TruckDto> GetTruck(Guid id)
        {
           
            TruckDto Truck = id == Guid.Empty ? new TruckDto() { } : null;
            Truck = Truck ?? await _dbContext.Trucks.Where(p => p.Id == id).Include(p => p.Compartments).ThenInclude(p => p.Product).Select<Truck, TruckDto>(TruckProjection.TruckDto).FirstOrDefaultAsync();
          
            if (Truck == null)
                throw new NotFoundCustomException("Record is not found");
           
            return Truck;
        }

        public async Task<TruckDto> SaveTruck(TruckDto truckDto, IUserProfile profile)
        {
            var truck = await _dbContext.Trucks.CreateOrUpdateAsync(truckDto, truckDto.Compartments, profile);
            truckDto.Id = truck.Id;

           
            await _dbContext.SaveChangesAsync();
            
            return truckDto;
        }

        public async Task DeleteTruck(Guid id, IUserProfile user)
        {
            var result = await _dbContext.Trucks.DeleteAsync(id, user);
            if (result == null)
                return;

            await _dbContext.SaveChangesAsync();
        }

    }
}
