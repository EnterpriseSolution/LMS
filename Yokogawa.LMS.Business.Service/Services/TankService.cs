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
using Yokogawa.LMS.Business.Data.Enums;

namespace Yokogawa.LMS.Business.Services
{
    public class TankService : ITankService
    {
        private LMSDBContext _dbContext;
        private readonly ILogger<TankService> _logger;
        public TankService(LMSDBContext dbContext, ILogger<TankService> logger) 
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<PagedCollection<TankDto>> GetTanks(IFilter filter)
        {
            var list= await _dbContext.Tanks.ExcludeDeletion().AsNoTracking().GetQuery(filter)
                                          .Select<Tank, TankDto>(TankProjection.TankDto)
                                          .ToPagedCollectionAsync(filter);
            foreach (TankDto dto in list.Items)
            {
                dto.TankTypeDescription = UtilEnum.GetDescription(typeof(TankType), dto.TankType);
                dto.StatusDescription = dto.Status ? UtilEnum.GetDescription(typeof(TankStatus), (int)TankStatus.Valid) : UtilEnum.GetDescription(typeof(TankStatus), (int)TankStatus.Invalid);
            }
            return list;
        }

        public async Task<TankDto> GetTank(Guid id)
        {
            TankDto tank = id == Guid.Empty ? new TankDto() { } : null;
            tank = tank ?? await _dbContext.Tanks.GetById(id).ExcludeDeletion().Select(TankProjection.TankDto).FirstOrDefaultAsync<TankDto>();
            
            if (tank == null)
                throw new NotFoundCustomException("Record is not found");

            return tank;
        }

        public bool CheckTank(string tankNo)
        {
            return _dbContext.Tanks.FirstOrDefault(en => en.TankNo == tankNo) == null;
        }

        public async Task<TankDto> SaveTank(TankDto tankDto, IUserProfile profile)
        {
            var tank = await _dbContext.Tanks.CreateOrUpdateAsync(tankDto, profile);
            await _dbContext.SaveChangesAsync();
            tankDto.Id = tank.Id;
            return tankDto;
        }

        public async Task DeleteTank(Guid id, IUserProfile user)
        {
            var result = await _dbContext.Tanks.DeleteAsync(id, user);
            if (result == null)
                return;

            await _dbContext.SaveChangesAsync();
        }
    }
}
 