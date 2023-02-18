using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.Data.Infrastructure.Extensions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.QueryObjects
{
    public static class UserQuery
    {
        public static IQueryable<UserOTPSetting> GetByUserId(this IQueryable<UserOTPSetting> query, string userId)
        {
            return query.Where(o => o.UserId == userId);
        }

        public static IQueryable<User> GetByUserId(this IQueryable<User> query, string userId)
        {
            return query.ExcludeDeletion().Where(o => o.UserId == userId);
        }
    }
}
