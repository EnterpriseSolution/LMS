using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.LMS.Platform.Core.Services.Interfaces
{
    public interface IRoleService
    {
        Task<List<RoleDto>> GetRoles(IUserProfile user, Guid websiteId);

        Task<PagedCollection<RoleDto>> GetPaginatedRoles(IUserProfile user, Guid websiteId, IFilter filter);

        Task<RoleDto> GetRole(Guid id, Guid websiteId, IUserProfile user);

        Task<RoleDto> SaveRole(RoleDto roleDto, IUserProfile user);
        Task DeleteRole(Guid id, IUserProfile user);
        Task RemoveUsersFromRole(Guid roleId, IUserProfile user);
        Task RemoveUserFromRole(Guid roleId, string userId, IUserProfile user);
        Task<IEnumerable<UserDto>> GetUserRoles(Guid roleId, IUserProfile user);
        Task<IEnumerable<RoleDto>> GetRolesWithoutAdmin(Guid websiteId, IUserProfile user);
    }
}
