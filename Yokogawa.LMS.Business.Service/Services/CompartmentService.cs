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
    public class CompartmentService : ICompartmentService
    {
        private LMSDBContext _dbContext;
        private readonly ILogger<CompartmentService> _logger;
        public CompartmentService(LMSDBContext dbContext, ILogger<CompartmentService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<PagedCollection<CompartmentDto>> GetCompartments(IFilter filter)
        {
            return await _dbContext.Compartments.ExcludeDeletion().AsNoTracking().GetQuery(filter)
                                            .Select<Compartment, CompartmentDto>(CompartmentProjection.CompartmentDto)
                                            .ToPagedCollectionAsync(filter);

        }

        public async Task<List<CompartmentDto>> GetCompartmentsByTruckId(String truckId)
        {
            return await _dbContext.Compartments.Where(p=>p.TruckId==Guid.Parse(truckId)).ExcludeDeletion().AsNoTracking()
                                            .Select<Compartment, CompartmentDto>(CompartmentProjection.CompartmentDto)
                                            .ToListAsync();

        }

        public async Task<CompartmentDto> GetCompartment(Guid id)
        {
             CompartmentDto Compartment = id == Guid.Empty ? new CompartmentDto() { } : null;
            Compartment = Compartment ?? await _dbContext.Compartments.GetById(id).ExcludeDeletion().Select(CompartmentProjection.CompartmentDto).FirstOrDefaultAsync<CompartmentDto>();

            if (Compartment == null)
                throw new NotFoundCustomException("Record is not found");
             return Compartment;
        }

        public async Task<CompartmentDto> SaveCompartment(CompartmentDto cardDto, IUserProfile profile)
        {
            var Compartment = await _dbContext.Compartments.CreateOrUpdateAsync(cardDto, profile);
            await _dbContext.SaveChangesAsync();
            cardDto.Id = Compartment.Id;
            return cardDto;
        }

        public async Task DeleteCompartment(Guid id, IUserProfile user)
        {
            var result = await _dbContext.Compartments.DeleteAsync(id, user);
            if (result == null)
                return;

            await _dbContext.SaveChangesAsync();
        }
    }
}
