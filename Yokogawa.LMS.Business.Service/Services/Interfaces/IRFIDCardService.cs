using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.Data.Infrastructure.DTOs;

namespace Yokogawa.LMS.Business.Services.Interfaces
{
    public interface IRFIDCardService
    {
        Task<PagedCollection<RFIDCardDto>> GetRFIDCards(IFilter filter);
        Task<RFIDCardDto> GetRFIDCard(Guid id);
        Task<RFIDCardDto> SaveRFIDCard(RFIDCardDto cardDto, IUserProfile user);
        Task DeleteRFIDCard(Guid id, IUserProfile user);
        bool CheckCard(string cardNo);
    }
}
