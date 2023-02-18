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
    public class VesselService : IVesselService
    {
        private LMSDBContext _dbContext;
        private readonly ILogger<VesselService> _logger;
        public VesselService(LMSDBContext dbContext, ILogger<VesselService> logger) 
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<PagedCollection<VesselDto>> GetVessels(IFilter filter)
        {
            return await _dbContext.Vessels.ExcludeDeletion().AsNoTracking().GetQuery(filter)
                                          .Select<Vessel, VesselDto>(VesselProjection.VesselDto)
                                          .ToPagedCollectionAsync(filter);

        }

        public async Task<VesselDto> GetVessel(Guid id)
        {
            VesselDto vessel = id == Guid.Empty ? new VesselDto() { } : null;
            vessel = vessel ?? await _dbContext.Vessels.GetById(id).ExcludeDeletion().Select(VesselProjection.VesselDto).FirstOrDefaultAsync<VesselDto>();
            
            if (vessel == null)
                throw new NotFoundCustomException("Record is not found");

            return vessel;
        }

        public async Task<VesselDto> SaveVessel(VesselDto vesselDto, IUserProfile profile)
        {
            var vessel = await _dbContext.Vessels.CreateOrUpdateAsync(vesselDto, profile);
            await _dbContext.SaveChangesAsync();
            vesselDto.Id = vessel.Id;
            return vesselDto;
        }

        public async Task DeleteVessel(Guid id, IUserProfile user)
        {
            var result = await _dbContext.Vessels.DeleteAsync(id, user);
            if (result == null)
                return;

            await _dbContext.SaveChangesAsync();
        }

        public bool CheckVessel(string vesselName)
        {
            return _dbContext.Vessels.FirstOrDefault(en => en.VesselName == vesselName) == null;
        }
    }
}
 