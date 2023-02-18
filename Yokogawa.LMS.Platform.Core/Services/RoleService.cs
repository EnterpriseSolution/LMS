using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Yokogawa.LMS.Platform.Data;
using Microsoft.Extensions.Logging;
using Yokogawa.LMS.Platform.Core.Services.Interfaces;
using System.Threading.Tasks;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.LMS.Platform.Core.DTOs;
using Microsoft.EntityFrameworkCore;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Platform.Data.Commands;
using Yokogawa.LMS.Platform.Data.QueryObjects;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Data.Infrastructure.Extensions;
using Yokogawa.LMS.Platform.Core.Projections;
using Yokogawa.LMS.Exceptions;
using Yokogawa.LMS.Platform.Core.QueryObjects;

namespace Yokogawa.LMS.Platform.Core.Services
{
    public class RoleService : BaseService<RoleService>, IRoleService
    {
        public RoleService(JoypadDBContext dbContext, ILogger<RoleService> logger) : base(dbContext, logger)
        {
        }

        public async Task DeleteRole(Guid id,IUserProfile user)
        {
            var isDeleted = await _dbContext.UserRoles.Where(o => o.RoleId == id).CountAsync() == 0;
            if (!isDeleted)
                throw new ConflictException("Please remove users from role before delete the role");

            isDeleted = await _dbContext.Roles.DeleteAsync(id, user);
            if (isDeleted)
               await _dbContext.SaveChangesAsync();
        }

        public async Task<PagedCollection<RoleDto>> GetPaginatedRoles(IUserProfile user, Guid websiteId, IFilter filter)
        {
            PagedCollection<RoleDto> result = new PagedCollection<RoleDto>();
            var permssionLevel = await GetPermissionLevel(user, websiteId);
            if (permssionLevel == EnumPermissionLevel.SystemAdmin)
                result = await _dbContext.Roles.GetQuery(filter).ToPagedCollectionAsync<Role, RoleDto>(filter, o => new RoleDto
                {
                    Id = o.Id,
                    Name = o.Name,
                    Description = o.Description,
                    LastModifiedBy = o.UpdatedOn.HasValue ? o.UpdatedBy : o.CreatedBy,
                    LastModifiedOn = o.UpdatedOn.HasValue ? o.UpdatedOn.Value : o.CreatedOn
                });
            else if (permssionLevel == EnumPermissionLevel.WebsiteAdmin)
            {
                result = await _dbContext.Roles.Where(o => o.Id != PredefinedValues.AdminRoleId && o.DefaultWebsiteId == websiteId).GetQuery(filter).ToPagedCollectionAsync<Role,RoleDto>(filter,o => new RoleDto
                {
                    Id = o.Id,
                    Name = o.Name,
                    Description = o.Description,
                    LastModifiedBy = o.UpdatedOn.HasValue ? o.UpdatedBy : o.CreatedBy,
                    LastModifiedOn = o.UpdatedOn.HasValue ? o.UpdatedOn.Value : o.CreatedOn
                });

            }
            return result;
        }

        public async Task<RoleDto> GetRole(Guid id,Guid websiteId, IUserProfile user)
        {
            var permssionLevel = await GetPermissionLevel(user, websiteId);
            RoleDto role = null;
            if (id == Guid.Empty)
                role = new RoleDto() {DefaultWebsiteId = websiteId };
            else
                role = await _dbContext.Roles.GetById(id).Select<Role, RoleDto>(RoleProjection.RoleDetailDto).FirstOrDefaultAsync();

            if (role == null || permssionLevel == EnumPermissionLevel.User || (permssionLevel == EnumPermissionLevel.WebsiteAdmin && role.DefaultWebsiteId != websiteId))
                throw new NotFoundCustomException("Record is not found");


            role.WebsiteId =  websiteId;
            role.Users = await (from item in _dbContext.V_ActiveUsers
                                join userrole in _dbContext.UserRoles on item.UserId equals userrole.UserId
                                where userrole.RoleId == role.Id
                                select item).GetByPermission(permssionLevel, websiteId, user.UserId).ToListAsync();

            var query = _dbContext.V_WebsiteMenus.Where(o => o.WebsiteId == websiteId && o.SecurityLevel == 0);

            var website = await _dbContext.Websites.Where(o => o.Id == websiteId).FirstOrDefaultAsync();

            if (website.AdminRoleId == role.Id && role.Id != Guid.Empty || role.Id == PredefinedValues.AdminRoleId)
                role.Permissions = new List<MenuDto>(); //await query.Where(o=>o.IsSystemMenu==0).Select<V_WebsiteMenu, MenuDto>(MenuProjection.MenuViewDto).OrderBy(o => o.Name).ToListAsync();
            else
                role.Permissions = await query.Select<V_WebsiteMenu, MenuDto>(MenuProjection.MenuViewDto).OrderBy(o => o.Name).ToListAsync();

            var predefinedPermssionIds = await query.Where(o =>o.IsSystemMenu == 1).Select(o => o.MenuId).ToListAsync();

            if (id == Guid.Empty) {
                foreach (Guid menuId in predefinedPermssionIds)
                    if (!role.PermissionIds.Contains(menuId))
                        role.PermissionIds.Add(menuId);
            }
                
            role.SFAproviders = await _dbContext.SFAProviders.Select(o => new SFAProvider() { Id = o.Id, Name = o.Name }).ToListAsync();

            role.WidgetSettings = await _dbContext.V_RoleWebsiteWidgetSettings.Where(o=>o.RoleId == role.Id)
                .Select<V_RoleWebsiteWidgetSetting, WidgetSettingDto>(o => new WidgetSettingDto()
            {
                RoleId = o.RoleId,
                WidgetId = o.WidgetId,
                WidgetName = o.WidgetName,
                JSONParameter = o.JSONParameter,
                WebsiteId = o.WebsiteId
            }).ToListAsync();

            
            return role;

        }

        public async Task<List<RoleDto>> GetRoles(IUserProfile user, Guid websiteId)
        {
            List<RoleDto> result = new List<RoleDto>();
            var permssionLevel =await GetPermissionLevel(user,websiteId);

            if (permssionLevel == EnumPermissionLevel.SystemAdmin)
                result = await _dbContext.Roles.Where(o => o.DefaultWebsiteId == websiteId || o.DefaultWebsiteId == PredefinedValues.AllWebsiteId).Select(o => new RoleDto
                {
                    Id = o.Id,
                    Name = o.Name,
                    Description = o.Description,
                    IsSystemDefined = o.IsSystemDefined,
                    LastModifiedBy = o.UpdatedOn.HasValue ? o.UpdatedBy : o.CreatedBy,
                    LastModifiedOn = o.UpdatedOn.HasValue ? o.UpdatedOn.Value : o.CreatedOn
                }).ToListAsync<RoleDto>();
            else if (permssionLevel == EnumPermissionLevel.WebsiteAdmin)
            {
                result = await _dbContext.Roles.Where(o => o.Id != PredefinedValues.AdminRoleId && o.DefaultWebsiteId == websiteId).Select(o => new RoleDto
                {
                    Id = o.Id,
                    Name = o.Name,
                    Description = o.Description,
                    IsSystemDefined = o.IsSystemDefined,
                    LastModifiedBy = o.UpdatedOn.HasValue ? o.UpdatedBy : o.CreatedBy,
                    LastModifiedOn = o.UpdatedOn.HasValue ? o.UpdatedOn.Value : o.CreatedOn
                }).ToListAsync<RoleDto>();

            }
            /*else
            {
                result = await _dbContext.Roles.Where(o => o.CreatedBy == user.UserId && o.DefaultWebsiteId == websiteId).Select(o => new RoleDto
                {
                    Id = o.Id,
                    Name = o.Name,
                    Description = o.Description,
                    LastModifiedBy = o.UpdatedOn.HasValue ? o.UpdatedBy : o.CreatedBy,
                    LastModifiedOn = o.UpdatedOn.HasValue ? o.UpdatedOn.Value : o.CreatedOn
                }).ToListAsync();
            }*/

            return result;
        }

        
        public async Task<RoleDto> SaveRole(RoleDto roleDto, IUserProfile user)
        {
            var role =  await _dbContext.Roles.CreateOrUpdateAsync(roleDto,user);
            role.CreateOrUpdate(roleDto.WidgetSettings);
            role.CreateOrUpdate(roleDto.ModulePermissions);
            var newUsers = await _dbContext.V_ActiveUsers.GetNewExternalUsersAsync(roleDto.Users);
            foreach (var item in newUsers)
                item.DefaultWebsiteId = roleDto.WebsiteId;

            await _dbContext.ADUsers.CreateOrUpdateAsync(newUsers, user);

            var isAdmin = IsSystemAdmin(user);
            var query = (from item in _dbContext.V_ActiveUsers
                         join userrole in _dbContext.UserRoles on  item.UserId equals userrole.UserId
                         where userrole.RoleId == roleDto.Id && 
                         ((isAdmin && item.DefaultWebsiteId == PredefinedValues.AllWebsiteId) || item.DefaultWebsiteId==roleDto.WebsiteId) 
                         select userrole);
       
            var userRoles = await _dbContext.UserRoles.AssignUsersToRoleAsync(roleDto, roleDto.Users,query);
            foreach (var item in userRoles)
                role.UserRoles.Add(item);

            //filter menus not under the website
            roleDto.PermissionIds = await _dbContext.Menus
                .Where(o => ((o.WebsiteId == PredefinedValues.AllWebsiteId  || o.WebsiteId == roleDto.WebsiteId) && o.SecurityLevel == 0) && roleDto.PermissionIds.Contains(o.Id))
                .Select(o => o.Id).ToListAsync();
    
            var newPermssions = await _dbContext.Permissions.CreateAsync(roleDto);
            foreach (var item in newPermssions)
                role.Permissions.Add(item);

            //create secret
            if (roleDto.SFAProviderIds.Count() > 0)
            {
                List<MFASettingDto> settingDtos = new List<MFASettingDto>();
                foreach (var id in roleDto.SFAProviderIds)
                {
                    newUsers = await _dbContext.UserOTPSettings.ValidateCreateSecretAsync(id, roleDto.Users);
                    if (newUsers.Count() == 0)
                        continue;

                    var item = new MFASettingDto() { ProviderId = id };
                    foreach (var userItem in newUsers)
                        item.UserId = userItem.UserId;

                    settingDtos.Add(item);
                }

                await _dbContext.UserOTPSettings.CreateSecretAsync(settingDtos, user);
            }
            await _dbContext.SaveChangesAsync();
            roleDto.Id = role.Id;
            return roleDto;
        }

        public async Task RemoveUsersFromRole(Guid roleId, IUserProfile user) {
            var role = _dbContext.Roles.GetById(roleId).Include(o=>o.UserRoles).FirstOrDefault();
            if (role == null)
                return;

            var permissionLevel = await GetPermissionLevel(user, role.DefaultWebsiteId);

            if (permissionLevel == EnumPermissionLevel.User)
                throw new ConflictException("Action is not allowed");

            if (permissionLevel == EnumPermissionLevel.SystemAdmin)
                role.UserRoles.Clear();
            else 
            {
                List<UserRole> userRoles = await (from item in _dbContext.UserRoles
                                                  join userItem in _dbContext.V_ActiveUsers on item.UserId equals userItem.UserId
                                                  where item.RoleId == roleId
                                                  select new
                                                  {
                                                      UserRole = item,
                                                      User = userItem
                                                  }).Where(o => o.User.DefaultWebsiteId == role.DefaultWebsiteId).Select(o => o.UserRole).ToListAsync();

                foreach (var userRole in userRoles)
                    role.UserRoles.Remove(userRole);

            }
            await _dbContext.SaveChangesAsync();

        }

        public async Task RemoveUserFromRole(Guid roleId, string userId, IUserProfile user)
        {
            var role = _dbContext.Roles.GetById(roleId).Include(o => o.UserRoles).FirstOrDefault();
            if (role == null)
                return;

            var permissionLevel = await GetPermissionLevel(user, role.DefaultWebsiteId);

            if (permissionLevel == EnumPermissionLevel.User)
                throw new ConflictException("Action is not allowed");

            UserRole userRole = null;

            if (permissionLevel == EnumPermissionLevel.SystemAdmin)
                userRole = role.UserRoles.Where(o => o.UserId == userId).FirstOrDefault();
            else
            {
                
                userRole = await (from item in _dbContext.UserRoles
                             join userItem in _dbContext.V_ActiveUsers on item.UserId equals userItem.UserId
                             where item.RoleId == roleId && userItem.UserId == userId
                             select new
                             {
                                 UserRole = item,
                                 User = userItem
                             }).Where(o => o.User.DefaultWebsiteId == role.DefaultWebsiteId).Select(o => o.UserRole).FirstOrDefaultAsync();
            }

            if (userRole != null) {
                role.UserRoles.Remove(userRole);
                await _dbContext.SaveChangesAsync();
            }
            

        }

        public async Task<IEnumerable<UserDto>> GetUserRoles(Guid roleId,IUserProfile user) {
            var role =await _dbContext.Roles.GetById(roleId).FirstOrDefaultAsync();

            if (role == null)
                return new List<UserDto>();

            var permssionLevel = await GetPermissionLevel(user, role.DefaultWebsiteId);

            if (permssionLevel == EnumPermissionLevel.User) //&&  role.CreatedBy != user.UserId)
                return new List<UserDto>();

            return await (from item in _dbContext.V_ActiveUsers
                          join userrole in _dbContext.UserRoles on item.UserId equals userrole.UserId
                          where userrole.RoleId == roleId
                          select item).GetByPermission(permssionLevel, role.DefaultWebsiteId, user.UserId).ToListAsync();
        }

        public async Task<IEnumerable<RoleDto>> GetRolesWithoutAdmin(Guid websiteId, IUserProfile user)
        {
            List<RoleDto> result = new List<RoleDto>();
            var permssionLevel = await GetPermissionLevel(user, websiteId);

            if (permssionLevel == EnumPermissionLevel.User)
                return result;

            var websiteAdmins = await _dbContext.Websites.Where(o => o.AdminRoleId.HasValue).Select(o => o.AdminRoleId).ToListAsync();

            result = await _dbContext.Roles.Where(o => o.Id != PredefinedValues.AdminRoleId && o.DefaultWebsiteId == websiteId && !websiteAdmins.Contains(o.Id)).Select(o => new RoleDto
                {
                    Id = o.Id,
                    Name = o.Name,
                    Description = o.Description,
                    IsSystemDefined = o.IsSystemDefined,
                    LastModifiedBy = o.UpdatedOn.HasValue ? o.UpdatedBy : o.CreatedBy,
                    LastModifiedOn = o.UpdatedOn.HasValue ? o.UpdatedOn.Value : o.CreatedOn
                }).ToListAsync<RoleDto>();

            return result;
        }
    }
}
