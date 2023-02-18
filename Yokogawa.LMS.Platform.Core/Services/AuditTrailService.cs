using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Yokogawa.LMS.Platform.Data;
using Yokogawa.Data.Infrastructure.Services;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Data.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.LMS.Platform.Data.Entities;

namespace Yokogawa.LMS.Platform.Core.Services
{
    public class AuditTrailService: BaseService<AuditTrailService>, IAuditTrailService
    {
        public AuditTrailService(JoypadDBContext dbContext, ILogger<AuditTrailService> logger) : base(dbContext, logger)
        { 
        }
        public async Task<PagedCollection<Audit>> GetPaginatedSystemAuditTrailsAsync(BaseFilter f,string websiteId)
        {
            if (string.IsNullOrEmpty(f.OrderBy)) {
                f.OrderBy = "Timestamp";
                f.IsAscending = false;
            }

            return await _dbContext.Audits.Where(o => o.TableName.EndsWith("_" + websiteId) || o.TableName.EndsWith("_" + PredefinedValues.AllWebsiteId.ToString())).GetQuery(f).AsNoTracking().ToPagedCollectionAsync(f);
        }

        public async Task<PagedCollection<Audit>> GetPaginatedWebsiteAuditTrailsAsync(BaseFilter f,string websiteId)
        {
            if (string.IsNullOrEmpty(f.OrderBy))
            {
                f.OrderBy = "Timestamp";
                f.IsAscending = false;
            }
            return await _dbContext.Audits.Where(o=>o.TableName.EndsWith("_"+websiteId)).GetQuery(f).AsNoTracking().ToPagedCollectionAsync(f);
        }
    }
}
