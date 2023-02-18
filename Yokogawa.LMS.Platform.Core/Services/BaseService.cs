using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using Yokogawa.LMS.Platform.Data;
using Microsoft.Extensions.Logging;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Platform.Data.Commands;
using Microsoft.EntityFrameworkCore;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.LMS.Platform.Data.Entities;
using System.Security.Claims;

namespace Yokogawa.LMS.Platform.Core.Services
{
    public class BaseService<T>
    {
        protected JoypadDBContext _dbContext;
        protected ILogger<T> _logger;
        protected IUserProfile _userProfile;
        
        public BaseService(JoypadDBContext dbContext,ILogger<T> logger) { 
            _logger = logger;
            _dbContext = dbContext;
        }

        protected bool IsSystemAdmin(IUserProfile user) {
            return user.RoleIds.Contains(PredefinedValues.AdminRoleId.ToString());
        }

        protected async Task<EnumPermissionLevel> GetPermissionLevel(IUserProfile user, Guid websiteId)
        {
            var isAdmin = user.RoleIds.Contains(PredefinedValues.AdminRoleId.ToString());
            if (isAdmin)
                return EnumPermissionLevel.SystemAdmin;

            var isWebsiteAdmin = await _dbContext.Websites.VerifyWebsiteAdminAsync(websiteId, user.RoleIds);

            if (isWebsiteAdmin)
                return EnumPermissionLevel.WebsiteAdmin;

            return EnumPermissionLevel.User;

        }

    }
}
