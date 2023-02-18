using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Yokogawa.Data.Infrastructure.Services;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Data.Infrastructure.Entities;
using Microsoft.Extensions.Logging;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.Security.OAuth.Identity;
using Yokogawa.LMS.Platform.Data.Entities;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Authorization;

namespace Yokogawa.LMS.Platform.Web.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AuditTrailsController : ControllerBase
    {
        IAuditTrailService _auditTrailService;
        IUserProfile _identity;
        IUserProfile Identity
        {
            get
            {
                if (_identity == null)
                    _identity = this.HttpContext.User.GetUserAccount();
                return _identity;
            }
        }
        public AuditTrailsController(IAuditTrailService auditTrailService)
        {
            _auditTrailService = auditTrailService;
        }

        [HttpPost]
        [Route("list")]
        public async Task<PagedCollection<Audit>> GetAuditTrails(dynamic request)
        {
            JObject  input = (JObject)request;
            string websiteId = ((JValue)input.SelectToken("websiteId")).ToString();
            string filterJson = ((JObject)input.SelectToken("filter")).ToString();
            BaseFilter filter = JsonConvert.DeserializeObject<BaseFilter>(filterJson);
            
            
            if (Identity.RoleIds.Contains(PredefinedValues.AdminRoleId.ToString()))
                return await _auditTrailService.GetPaginatedSystemAuditTrailsAsync(filter,websiteId);
            else
                return await _auditTrailService.GetPaginatedWebsiteAuditTrailsAsync(filter, websiteId);
        }
    }
}