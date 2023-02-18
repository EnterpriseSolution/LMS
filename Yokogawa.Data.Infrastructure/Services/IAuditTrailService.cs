using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Data.Infrastructure.Entities;

namespace Yokogawa.Data.Infrastructure.Services
{
    public interface IAuditTrailService
    {
        Task<PagedCollection<Audit>> GetPaginatedSystemAuditTrailsAsync(BaseFilter f,string websiteId);
        Task<PagedCollection<Audit>> GetPaginatedWebsiteAuditTrailsAsync(BaseFilter f, string websiteId);
    }
}
