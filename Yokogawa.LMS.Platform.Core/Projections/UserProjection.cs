using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Linq.Expressions;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.Data.Infrastructure.Utils;
using Yokogawa.Data.Infrastructure.Extensions;
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.LMS.Platform.Core.Projections
{
    public class UserProjection
    {
        public static Expression<Func<User, UserDto>> BasicUserDto
        {
            get
            {
                return (m) => new UserDto()
                {
                    Id = m.Id,
                    UserId = m.UserId,
                    DisplayName = m.DisplayName,
                    Email = m.Email,
                    Company = m.Company,
                    DefaultWebsiteId = m.DefaultWebsiteId,
                    WebsiteId = m.DefaultWebsiteId,
                    IsSystemDefined = m.IsSystemDefined
                }.GetAudit<UserDto>(m);
            }
        }

        public static Expression<Func<ADUser, UserDto>> ExternalUserDto
        {
            get
            {
                return (m) => new UserDto()
                {
                    Id = m.Id,
                    UserId = m.UserId,
                    DisplayName = m.DisplayName,
                    Email = m.Email,
                    Company = m.Company,
                    DefaultWebsiteId = m.DefaultWebsiteId,
                    WebsiteId = m.DefaultWebsiteId
                }.GetAudit<UserDto>(m);
            }
        }

        public static Expression<Func<User, UserDto>> UserDto
        {
            get
            {
                return (m) => new UserDto()
                {
                    Id = m.Id,
                    UserId = m.UserId,
                    DisplayName = m.DisplayName,
                    Email = m.Email,
                    Company = m.Company,
                    Password = m.Password,
                    DefaultWebsiteId = m.DefaultWebsiteId,
                    WebsiteId = m.DefaultWebsiteId,
                    IsSystemDefined = m.IsSystemDefined
                }.GetAudit<UserDto>(m);
            }
        }

        public static Expression<Func<V_ActiveUser, UserDto>> ActiveUserDto
        {
            get
            {
                return (m) => new UserDto()
                {
                    UserId = m.UserId,
                    DisplayName = m.DisplayName,
                    Email = m.Email,
                    Company = m.Company,
                    WebsiteId = m.DefaultWebsiteId
                };
            }
        }
    }
}
