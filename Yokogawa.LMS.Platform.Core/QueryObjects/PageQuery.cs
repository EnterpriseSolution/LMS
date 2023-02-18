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
    public static class PageQuery
    {
        public static IQueryable<PageDto> GetByPermission(this IQueryable<Page> query, EnumPermissionLevel permissionLevel,Guid websiteId,string userId) {
            IQueryable<PageDto> result = null;
            if (permissionLevel == EnumPermissionLevel.SystemAdmin)
                result =  query.Include(o=>o.Widget).AsNoTracking().Where(o => o.Widget == null || (o.Widget != null && (o.Widget.DefaultWebsiteId == websiteId || o.Widget.DefaultWebsiteId == PredefinedValues.AllWebsiteId))).OrderBy(o => o.Description).Select<Page, PageDto>(PageProjection.PageDto);
            else if (permissionLevel == EnumPermissionLevel.WebsiteAdmin)
                result = query.Include(o => o.Widget).AsNoTracking().Where(o => o.Widget == null || (o.Widget != null && (o.Widget.DefaultWebsiteId == websiteId))).OrderBy(o => o.Description).Select<Page, PageDto>(PageProjection.PageDto);
            else
                result  = query.Include(o => o.Widget).AsNoTracking().Where(o=>o.CreatedBy=="").OrderBy(o => o.Url).Select<Page, PageDto>(PageProjection.PageDto);
            //  result = query.Include(o => o.Widget).AsNoTracking().Where(o => o.CreatedBy == userId).Select<Page, PageDto>(PageProjection.PageDto);
            return result;

        }
    }
}
