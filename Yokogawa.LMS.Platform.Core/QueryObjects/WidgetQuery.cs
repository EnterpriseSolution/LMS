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
    public static class WidgetQuery
    {
        public static IQueryable<WidgetDto> GetByPermission(this IQueryable<Widget> query, EnumPermissionLevel permissionLevel, Guid websiteId, string userId)
        {
            IQueryable<WidgetDto> result = null;
            if (permissionLevel == EnumPermissionLevel.SystemAdmin)
                result = query.AsNoTracking().Where(o => o.DefaultWebsiteId == websiteId || o.DefaultWebsiteId == PredefinedValues.AllWebsiteId).Select<Widget, WidgetDto>(WidgetProjection.WidgetListDto);
            else
                result = result = query.AsNoTracking().Where(o => o.DefaultWebsiteId == websiteId).Select<Widget, WidgetDto>(WidgetProjection.WidgetListDto);
            return result;
        }
    }
}
