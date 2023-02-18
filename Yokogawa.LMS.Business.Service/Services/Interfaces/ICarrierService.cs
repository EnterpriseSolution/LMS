using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.Data.Infrastructure.DTOs;

namespace Yokogawa.LMS.Business.Services.Interfaces
{
    public interface ICarrierService
    {
        Task<PagedCollection<CarrierDto>> GetCarriers(IFilter filter);
        Task<CarrierDto> GetCarrier(Guid id);
        Task<CarrierDto> SaveCarrier(CarrierDto carrierDto, IUserProfile user);
        Task DeleteCarrier(Guid id, IUserProfile user);
    }
}
