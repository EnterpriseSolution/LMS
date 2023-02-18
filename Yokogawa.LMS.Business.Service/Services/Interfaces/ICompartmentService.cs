using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.Data.Infrastructure.DTOs;

namespace Yokogawa.LMS.Business.Services.Interfaces
{
    public interface ICompartmentService
    {
        Task<PagedCollection<CompartmentDto>> GetCompartments(IFilter filter);
        Task<CompartmentDto> GetCompartment(Guid id);
        Task<CompartmentDto> SaveCompartment(CompartmentDto CompartmentDto, IUserProfile user);
        Task DeleteCompartment(Guid id, IUserProfile user);
        Task<List<CompartmentDto>> GetCompartmentsByTruckId(String truckId);
    }
}
