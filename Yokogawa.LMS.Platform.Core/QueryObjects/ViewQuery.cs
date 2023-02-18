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
    public static class ViewQuery
    {
        public static IQueryable<ViewDto> GetByPermission(this IQueryable<View> query, EnumPermissionLevel permissionLevel, Guid websiteId, string userId)
        {
            IQueryable<ViewDto> result = null;
            if (permissionLevel == EnumPermissionLevel.SystemAdmin)
                result = query.AsNoTracking().Where(o => o.DefaultWebsiteId == websiteId || o.DefaultWebsiteId == PredefinedValues.AllWebsiteId)
                    .Select<View, ViewDto>(DashboardProjection.ViewDto);
            else if (permissionLevel == EnumPermissionLevel.WebsiteAdmin)
                result = query.AsNoTracking().Where(o => o.DefaultWebsiteId == websiteId)
                    .Select<View, ViewDto>(DashboardProjection.ViewDto); 
            else {
                result = query.AsNoTracking().Where(o => o.DefaultWebsiteId == websiteId && o.CreatedBy == userId)
                    .Select<View, ViewDto>(DashboardProjection.ViewDto);

            }
            return result;
        }
    }
}
