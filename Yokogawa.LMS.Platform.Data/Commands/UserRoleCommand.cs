using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Exceptions;

namespace Yokogawa.LMS.Platform.Data.Commands
{
    public static class UserRoleCommand
    {
       public static async Task<IEnumerable<IUserDto>> GetNewExternalUsersAsync(this DbSet<V_ActiveUser> dbSet, IEnumerable<IUserDto> users)
        {
            var userIds = users.Select(o => o.UserId).ToList();
            var temp = await dbSet.Where(o => userIds.Contains(o.UserId)).Select(o => o.UserId).ToListAsync();
            return users.Where(o => !temp.Contains(o.UserId)).ToList();
        }

        public static async Task<List<string>> GetExistingUserRoles(this DbSet<UserRole> dbSet,Guid roleId,List<IUserDto> users) {
            var userIds = users.Select(o => o.UserId).ToList();
            return await dbSet.Where(o => userIds.Contains(o.UserId) && o.RoleId == roleId).Select(o=>o.UserId+":"+o.RoleId.ToString().ToLower()).ToListAsync();
        }

        public static async Task AssignRolesToUserAsync(this DbSet<UserRole> dbSet,IUserDto user,IEnumerable<string> roleIds,IUserProfile profile)
        {
            if (user == null)
                return;
            roleIds = roleIds ?? new List<string>();
            var roleList = roleIds.Where(id => !string.IsNullOrEmpty(id)).Select(id =>Guid.Parse(id)).ToList<Guid>();
            bool isAdmin = profile.RoleIds.Contains(PredefinedValues.AdminRoleId.ToString());
            var userRoles = await dbSet.Include(o=>o.Role).Where(o => o.UserId == user.UserId 
            && (o.Role.DefaultWebsiteId == user.WebsiteId 
            || (isAdmin && o.Role.DefaultWebsiteId == PredefinedValues.AllWebsiteId))).ToListAsync();

            if (roleList.Count() > 0) {                
                var allRoleIds = userRoles.Select(o => o.RoleId).ToList();

                var newRoles = roleList.Where(id => !allRoleIds.Contains(id)).ToList();
        
                foreach (var roleId in newRoles)
                {
                    var userRole = new UserRole()
                    {
                        UserId = user.UserId,
                        RoleId = roleId
                    };
                    dbSet.Add(userRole);
                    userRole.SetAudit(user, true, true);
                }
            }
          
            var deletedRoles = userRoles.Where(o =>!roleList.Contains(o.RoleId)).ToList();
            dbSet.RemoveRange(deletedRoles);
        }

        public static async Task<List<UserRole>> AssignUsersToRoleAsync(this DbSet<UserRole> dbSet,IRoleDto roleDto, IEnumerable<IUserDto> userList, IQueryable<UserRole> query)
        {
            List<UserRole> result = new List<UserRole>();
            if (roleDto == null)
                return result;

            userList = userList ?? new List<IUserDto>();
            query = query ?? dbSet.Where(o => o.RoleId == roleDto.Id);
            var userRoles = await query.ToListAsync();

            if (userList.Count()>0) {

                var allUserIds = userRoles.Select(o => o.UserId).ToList();
                var userIds = userList.Select(o => o.UserId).ToList();
                var newUsers = userList.Where(o => !allUserIds.Contains(o.UserId)).ToList();
                var existingUserRoles = await dbSet.GetExistingUserRoles(roleDto.Id, newUsers);
                foreach (var user in newUsers)
                {
                    if (existingUserRoles.Contains(user.UserId + ":" + roleDto.Id.ToString().ToLower()))
                        continue;

                    var userRole = new UserRole()
                    {
                        UserId = user.UserId,
                        RoleId = roleDto.Id
                    };
                  
                    userRole.SetAudit(roleDto, true, true);
                    result.Add(userRole);
                }

                var deletedUsers = userRoles.Where(o => !userIds.Contains(o.UserId)).ToList();
                dbSet.RemoveRange(deletedUsers);
            }

            return result;
        }

    }
}
