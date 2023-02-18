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
    public static class RefreshTokenQuery
    {
        public static IQueryable<RefreshToken> GetByCredential(this IQueryable<RefreshToken> query, string userId, Guid clientId)
        {
            return query.Where(o => o.UserId == userId && o.ClientId == clientId);
        }
    }
}
