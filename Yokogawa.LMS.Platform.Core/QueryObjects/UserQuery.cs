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
    public static class UserQuery
    {
        public static IQueryable<UserDto> GetByPermission(this IQueryable<V_ActiveUser> query, EnumPermissionLevel permissionLevel, Guid websiteId, string userId)
        {
            IQueryable<UserDto> result = null;
            if (permissionLevel == EnumPermissionLevel.SystemAdmin)
                result = query.AsNoTracking().Where(o => o.DefaultWebsiteId == PredefinedValues.AllWebsiteId || o.DefaultWebsiteId == websiteId).Select<V_ActiveUser, UserDto>(UserProjection.ActiveUserDto);
            else if (permissionLevel == EnumPermissionLevel.WebsiteAdmin)
                result = query.AsNoTracking().Where(o => o.DefaultWebsiteId == websiteId).Select<V_ActiveUser, UserDto>(UserProjection.ActiveUserDto);
            //else
              //  result = query.AsNoTracking().Where(o =>o.CreatedBy == userId && o.DefaultWebsiteId == websiteId).Select<V_ActiveUser, UserDto>(UserProjection.ActiveUserDto);
            return result;

        }

    }
}
