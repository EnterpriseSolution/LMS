using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Data.Infrastructure.Services;
using Yokogawa.LMS.Business.Data;
using Yokogawa.LMS.Platform.Core.Services;
using Yokogawa.LMS.Platform.Data.Entities;

namespace Yokogawa.LMS.Business.Service.Services
{
    public class AuditTrailService : IAuditTrailService
    {
        protected LMSDBContext _dbContext;
        protected ILogger _logger;
        public AuditTrailService(LMSDBContext dbContext, ILogger<AuditTrailService> logger)
        {
            _logger = logger;
            _dbContext = dbContext;
        }
        public async Task<PagedCollection<Audit>> GetPaginatedSystemAuditTrailsAsync(BaseFilter f, string websiteId)
        {
            if (string.IsNullOrEmpty(f.OrderBy))
            {
                f.OrderBy = "Timestamp";
                f.IsAscending = false;
            }

            return await _dbContext.Audits.Where(o => o.TableName.EndsWith("_" + websiteId) || o.TableName.EndsWith("_" + PredefinedValues.AllWebsiteId.ToString())).GetQuery(f).AsNoTracking().ToPagedCollectionAsync(f);
        }

        public async Task<PagedCollection<Audit>> GetPaginatedWebsiteAuditTrailsAsync(BaseFilter f, string websiteId)
        {
            if (string.IsNullOrEmpty(f.OrderBy))
            {
                f.OrderBy = "Timestamp";
                f.IsAscending = false;
            }
            return await _dbContext.Audits.Where(o => o.TableName.EndsWith("_" + websiteId)).GetQuery(f).AsNoTracking().ToPagedCollectionAsync(f);
        }
    }
}
