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
    public class RFIDCardService : IRFIDCardService
    {
        private LMSDBContext _dbContext;
        private readonly ILogger<RFIDCardService> _logger;
        public RFIDCardService(LMSDBContext dbContext, ILogger<RFIDCardService> logger) 
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<PagedCollection<RFIDCardDto>> GetRFIDCards(IFilter filter)
        {
            var result= await _dbContext.RFIDCards.ExcludeDeletion().AsNoTracking().GetQuery(filter)
                                             .Select<RFIDCard, RFIDCardDto>(RFIDCardProjection.RFIDCardDto)
                                             .ToPagedCollectionAsync(filter);
            foreach(var dto in result.Items)
            {               
                dto.CardTypeDescription = UtilEnum.GetDescription(typeof(CardType), dto.CardType);
                dto.StatusDescription = dto.Status ? UtilEnum.GetDescription(typeof(CardStatus), (int)CardStatus.Valid) : UtilEnum.GetDescription(typeof(CardStatus), (int)CardStatus.Invalid);
            }
            return result;
        }

        public async Task<RFIDCardDto> GetRFIDCard(Guid id)
        {
            RFIDCardDto card = id == Guid.Empty ? new RFIDCardDto() { } : null;
            card = card ?? await _dbContext.RFIDCards.GetById(id).ExcludeDeletion().Select(RFIDCardProjection.RFIDCardDto).FirstOrDefaultAsync<RFIDCardDto>();
            
            if (card == null)
                throw new NotFoundCustomException("Record is not found");

            return card;
        }

        public async Task<RFIDCardDto> SaveRFIDCard(RFIDCardDto cardDto, IUserProfile profile)
        {
            var card = await _dbContext.RFIDCards.CreateOrUpdateAsync(cardDto, profile);
            await _dbContext.SaveChangesAsync();
            cardDto.Id = card.Id;
            return cardDto;
        }

        public async Task DeleteRFIDCard(Guid id, IUserProfile user)
        {
            var result = await _dbContext.RFIDCards.DeleteAsync(id, user);
            if (result == null)
                return;

            await _dbContext.SaveChangesAsync();
        }

        public bool CheckCard(string cardNo)
        {
            return _dbContext.RFIDCards.FirstOrDefault(en => en.CardNo == cardNo) == null;
        }
    }
}
 