using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.LMS.Business.Data.Entities;
using Yokogawa.Data.Infrastructure.DTOs;

namespace Yokogawa.LMS.Business.Services.Interfaces
{
    public interface IJettyService
    {
        Task<PagedCollection<JettyDto>> GetJetties(IFilter filter);
        Task<JettyDto> GetJetty(Guid id);
        Task<JettyDto> SaveJetty(JettyDto jetty, IUserProfile user);
        Task DeleteJetty(Guid id, IUserProfile user);
    }
}
