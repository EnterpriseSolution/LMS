using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Yokogawa.LMS.Platform.Core.Projections;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.LMS.Platform.Core.DTOs;

namespace Yokogawa.LMS.Platform.Core.QueryObjects
{
    public static class RoleQuery
    {
        public static IQueryable<UserRole> GetByPermission(this IQueryable<UserRole> query, EnumPermissionLevel permissionLevel, Guid websiteId, string userId)
        {
            IQueryable<UserRole> result = null;
            if (permissionLevel == EnumPermissionLevel.SystemAdmin)
                result = query.Include(o => o.Role).AsNoTracking().Where(o => o.UserId == userId && (o.Role.DefaultWebsiteId == PredefinedValues.AllWebsiteId || o.Role.DefaultWebsiteId == websiteId));
            else if (permissionLevel == EnumPermissionLevel.WebsiteAdmin)
                result = query.Include(o => o.Role).AsNoTracking().Where(o => o.UserId == userId && o.Role.DefaultWebsiteId == websiteId);
            else
                result = query.Include(o => o.Role).AsNoTracking().Where(o => o.UserId == userId && o.CreatedBy == userId && o.Role.DefaultWebsiteId == websiteId);
            return result;

        }
    }
}
