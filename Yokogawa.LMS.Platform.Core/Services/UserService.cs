using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Yokogawa.LMS.Platform.Data;
using Microsoft.Extensions.Logging;
using Yokogawa.LMS.Platform.Core.Services.Interfaces;
using System.Threading.Tasks;
using Yokogawa.LMS.Platform.Core;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.LMS.Platform.Core.DTOs;
using Microsoft.EntityFrameworkCore;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Platform.Data.Commands;
using Yokogawa.Data.Infrastructure.Extensions;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Platform.Core.Projections;
using Yokogawa.Data.Infrastructure.Utils;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.LMS.Exceptions;
using Yokogawa.LMS.Platform.Core.QueryObjects;

namespace Yokogawa.LMS.Platform.Core.Services
{
    public class UserService:BaseService<UserService>,IUserService
    {
        //protected JoypadDBContext _dbContext;
        //private readonly ILogger<UserService> _logger;
        public UserService(JoypadDBContext dbContext, ILogger<UserService> logger):base(dbContext,logger) {
            
        }

        public async Task Signout(string userId, string clientId)
        {
            Guid appId = Guid.Parse(clientId);
            var refreshTokens = await _dbContext.RefreshTokens.Where(o => o.UserId == userId && o.ClientId == appId).ToListAsync();
            _dbContext.RefreshTokens.RemoveRange(refreshTokens);
            await _dbContext.SaveChangesAsync();
        }
        public async Task<bool> ChangePassword(string userId,string oldPwd, string newPwd, string domain="") {
            if (string.IsNullOrEmpty(domain))
            {
                var user = _dbContext.Users.ExcludeDeletion().Where(o => o.UserId == userId && o.Password == oldPwd).FirstOrDefault();
                if (user == null)
                    return false;
                user.Password = newPwd;
                await _dbContext.SaveChangesAsync();
            }
            else {
                oldPwd = oldPwd.Base64Decode();
                newPwd = newPwd.Base64Decode();
                DirectoryServicesUtility.ChangePassword(domain, userId, oldPwd, newPwd);
            }
            
            return true;
        }

        public async Task<List<JSONMasterPage>> getPortals(string userId)
        {
            List<JSONMasterPage> result = new List<JSONMasterPage>();
            var pages = await _dbContext.V_UserPortals.Where(o => o.UserId == userId).ToListAsync<V_UserPortal>();
            foreach (V_UserPortal page in pages)
            {
                JSONMasterPage masterPage = new JSONMasterPage()
                {
                    id = page.WebsiteId,
                    name = page.WebsiteName,
                    route = string.IsNullOrEmpty(page.Route)? page.WebsiteId.ToString():page.Route,
                    homepage = new JSONPageInfo()
                    {
                        Id = page.HomePageId,
                        url = page.Url
                    },
                    components = new List<string>()
                };

                if (!string.IsNullOrEmpty(page.Component))
                    masterPage.components.Add(page.Component);

                result.Add(masterPage);
            }
            return result;
        }

        public async Task<UserDto> GetUserProfile(UserDto user)
        {
            if (user == null)
                return user;

            var websites = await getPortals(user.UserId);
            user.Websites =(from website in websites
                             select new Website()
                             {
                                 Id = website.id,
                                 Name = website.name,
                                 Route = string.IsNullOrEmpty(website.route) ? website.id.ToString():website.route
                             }).OrderBy(o => o.Id).ToList<Website>();

            if (user.Websites.Count > 0)
                user.WebsiteId = user.Websites[0].Id;
            return user;
        }

        public async Task<JSONMasterPage> GetPortal(Guid websiteId,IUserProfile user)
        {
            JSONMasterPage masterPage = new JSONMasterPage() { id = websiteId };
            var permssionLevel = await GetPermissionLevel(user, websiteId);
            var page = await _dbContext.V_UserPortals.Where(o => o.UserId == user.UserId && o.WebsiteId == websiteId).FirstOrDefaultAsync<V_UserPortal>();

            if (null != page)
            {
                masterPage.name = page.WebsiteName;
                masterPage.homepage = new JSONPageInfo()
                {
                    Id = page.HomePageId,
                    url = page.Url,
                };

                masterPage.menus = await GetUserMenus(user.UserId, masterPage);
                masterPage.DefaultLanguageId = page.DefaultLanguageId;
                masterPage.route = string.IsNullOrEmpty(page.Route)?page.WebsiteId.ToString():page.Route;
            }

            masterPage.widgets = await (from widget in _dbContext.V_UserWidgets
                                        where widget.UserId == user.UserId && widget.WebsiteId == websiteId
                                        select new JSONWidget()
                                        {
                                            Id = widget.WidgetId.Value,
                                            Name = widget.Name,
                                            InstanceName = widget.InstanceName,
                                            ServiceUrl = widget.ServiceUrl,
                                            Component = widget.Component,
                                            TemplateFileFolder = widget.TemplateFileFolder
                                        }).ToListAsync();

            foreach (JSONWidget widget in masterPage.widgets)
            {
                if (!masterPage.components.Contains(widget.Component))
                    masterPage.components.Add(widget.Component);

                widget.RoleSettings = await (from userrole in _dbContext.UserRoles
                                       join setting in _dbContext.RoleWidgetSettings on userrole.RoleId equals setting.RoleId
                                       where setting.WidgetId == widget.Id && userrole.UserId == user.UserId && setting.WebsiteId == websiteId
                                       select setting.JSONParameter).ToListAsync<string>();
                int resourceType = Convert.ToInt32(EnumResourceType.API);
                int pageResource = Convert.ToInt32(EnumResourceType.Page);
                if (permssionLevel == EnumPermissionLevel.User)
                    widget.DisableResources = await _dbContext.ModulePermissions
                        .Where(o => o.WebsiteId == websiteId && o.ResourceType != resourceType && o.WidgetId.HasValue && o.WidgetId.Value == widget.Id && !o.WritePermission && user.RoleIds.Contains(o.RoleId.ToString()))
                        .Select(o => o.Name + (!o.ReadPermission && o.ResourceType == pageResource ? "_R" : "")).ToListAsync();

            }

            masterPage.dashboards = await GetDashboards(user.UserId, websiteId);
            
            if (IsSystemAdmin(user)) {
                var website = await _dbContext.Websites.GetById(websiteId).FirstOrDefaultAsync();
                masterPage.AuditTrailAPI = website != null ? website.AuditTrailAPI : null;
            }
            
            return masterPage;
        }

        public async Task<List<JSONMenus>> GetUserMenus(string userId, JSONMasterPage masterPage)
        {
            List<JSONMenus> result = new List<JSONMenus>();
            var pages = await _dbContext.V_UserPages.Where(o => o.UserId == userId && (o.WebsiteId == masterPage.id || o.WebsiteId == Guid.Empty)).OrderBy(o => o.OrderId).ToListAsync<V_UserPage>();

            var dashboards = await _dbContext.V_UserDashboardPages.Where(o => o.UserId == userId && o.WebsiteId == masterPage.id).OrderBy(o => o.OrderId).ToListAsync();

            if (dashboards.Count() > 0)
            {
                int index = 1;
                JSONMenus parent = new JSONMenus()
                {
                    id = Guid.Empty,
                    text = "Dashboards",
                    icon = "fas fa-chart-line",
                    page = null,
                    menus = new List<JSONMenus>()
                };
                result.Add(parent);
                foreach (V_UserDashboardPage page in dashboards)
                {
                    if (index == 1)
                        parent.page = new JSONPageInfo()
                        {
                            Id = page.PageId.ToString(),
                            url = page.Url
                        };

                    parent.menus.Add(new JSONMenus()
                    {
                        id = Guid.NewGuid(),
                        icon = page.Icon,
                        text = page.Name,
                        page = new JSONPageInfo()
                        {
                            Id = page.PageId.ToString(),
                            url = page.Url
                        }
                    });

                    index++;
                }

            }

            var menuIds = pages.Select(o => o.MenuId).ToList();

            foreach (V_UserPage page in pages)
            {
                if (page.ParentId.HasValue == false)
                {
                    JSONMenus menu = new JSONMenus()
                    {
                        id = page.MenuId,
                        text = page.MenusName,
                        icon = page.Icon,
                        page =  new JSONPageInfo()
                        {
                            Id = page.PageId,
                            url = menuIds.Contains(page.MenuId)? page.Url:""
                            //type = page.Type.HasValue ? page.Type.Value : 0,
                        }
                    };
                    result.Add(menu);
                    getSubMenus(menu, pages);
                }
            }

            return result;
        }

        private void getSubMenus(JSONMenus menu, List<V_UserPage> sources)
        {
            var pages = (from page in sources
                         where page.ParentId.HasValue == true && page.ParentId.Value == menu.id
                         select page).ToList();


            if (pages.Count() == 0)
                return;

            menu.menus = new List<JSONMenus>();
            pages = pages.OrderBy(o => o.OrderId).ToList();
            foreach (V_UserPage page in pages)
            {
                JSONMenus submenu = new JSONMenus()
                {
                    id = page.MenuId,
                    text = page.MenusName,
                    icon = page.Icon,
                    page = new JSONPageInfo()
                    {
                        Id = page.PageId,
                        url = page.Url
                    }
                };

                menu.menus.Add(submenu);
                getSubMenus(submenu, sources);
            }

        }

        public async Task<List<JSONDashboard>> GetDashboards(string userId, Guid websiteId)
        {
            List<JSONDashboard> dashboards = new List<JSONDashboard>();

            List<V_UserDashboard> result = await _dbContext.V_UserDashboards.Where(o => o.UserId == userId && o.WebsiteId == websiteId).ToListAsync<V_UserDashboard>();

            foreach (V_UserDashboard dashboard in result)
            {
                JSONView view = new JSONView()
                {
                    Id = dashboard.ViewId,
                    Action = dashboard.Action,
                    Model = dashboard.Model,
                    ViewModelType = dashboard.ViewModelType,
                    ServiceUrl = dashboard.ServiceUrl,
                    ViewName = (string.IsNullOrEmpty(dashboard.Model) ? dashboard.Name + '.' + dashboard.InstanceName + '.' : "") + dashboard.ViewName
                };

                JSONDashboard item = dashboards.Where(d => d.Id == dashboard.DashboardId).FirstOrDefault<JSONDashboard>();
                if (null == item)
                {
                    item = new JSONDashboard()
                    {
                        Id = dashboard.DashboardId,
                        Layout = dashboard.Layout,
                        ViewModelName = dashboard.ViewModelName,
                        Views = new List<JSONView>()
                    };
                    dashboards.Add(item);
                }

                item.Views.Add(view);
            }



            return dashboards;



        }

        public async Task<PagedCollection<UserDto>> GetPaginatedUsers(IUserProfile requestor,Guid websiteId, IFilter filter)
        {
            PagedCollection<UserDto> users = null;
            var permissionLevel = await GetPermissionLevel(requestor, websiteId);

            if (permissionLevel == EnumPermissionLevel.SystemAdmin)
                users = await _dbContext.Users.ExcludeDeletion().AsNoTracking().GetQuery(filter).Where(o => o.DefaultWebsiteId == websiteId || o.DefaultWebsiteId == PredefinedValues.AllWebsiteId).ToPagedCollectionAsync<User, UserDto>(filter, UserProjection.UserDto);
            else {
                
                if (permissionLevel == EnumPermissionLevel.WebsiteAdmin) {
                    users = await (from user in _dbContext.Users
                                  join userrole in _dbContext.UserRoles on user.UserId equals userrole.UserId
                                  where userrole.RoleId != PredefinedValues.AdminRoleId && (user.DefaultWebsiteId == websiteId || user.DefaultWebsiteId == PredefinedValues.AllWebsiteId)
                                  select user).ExcludeDeletion().AsNoTracking().GetQuery(filter).ToPagedCollectionAsync<User, UserDto>(filter, UserProjection.UserDto);
                }else 
                    users = await _dbContext.Users.ExcludeDeletion().Where(o => o.CreatedBy =="").AsNoTracking().GetQuery(filter).ToPagedCollectionAsync<User, UserDto>(filter, UserProjection.BasicUserDto);
            }
              

            return users;
        }

        public async Task<List<UserDto>> GetUsers(IUserProfile requestor, Guid websiteId,IFilter filter)
        {
            List<UserDto> users = new List<UserDto>();
            var permissionLevel = await GetPermissionLevel(requestor, websiteId);
            if (permissionLevel==EnumPermissionLevel.SystemAdmin) {
                users = await _dbContext.Users.ExcludeDeletion().AsNoTracking().GetQuery(filter).Where(o => o.DefaultWebsiteId == websiteId || o.DefaultWebsiteId == PredefinedValues.AllWebsiteId)
                .Select<User, UserDto>(UserProjection.BasicUserDto).ToListAsync();
            }
            else if (permissionLevel == EnumPermissionLevel.WebsiteAdmin)
            {
                users = await _dbContext.Users.ExcludeDeletion().Where(o => o.DefaultWebsiteId == websiteId && !o.IsSystemDefined)
                    .AsNoTracking().GetQuery(filter).Select<User, UserDto>(UserProjection.BasicUserDto).ToListAsync();
            } //else
                //users = await _dbContext.Users.ExcludeDeletion().Where(o => o.CreatedBy == requestor.UserId && o.DefaultWebsiteId == websiteId)
                  //      .AsNoTracking().GetQuery(filter).Select<User, UserDto>(UserProjection.BasicUserDto).ToListAsync();

            return users;
        }

        public async Task<PagedCollection<UserDto>> GetPaginatedExternalUsers(IUserProfile requestor, Guid websiteId, IFilter filter)
        {
            PagedCollection<UserDto> users = null;
            var permissionLevel = await GetPermissionLevel(requestor, websiteId);
            if (permissionLevel == EnumPermissionLevel.SystemAdmin)
                users = await _dbContext.ADUsers.ExcludeDeletion().AsNoTracking().GetQuery(filter).Where(o => o.DefaultWebsiteId == websiteId || o.DefaultWebsiteId == PredefinedValues.AllWebsiteId).ToPagedCollectionAsync<ADUser, UserDto>(filter, UserProjection.ExternalUserDto);
            else
            {
                if (permissionLevel == EnumPermissionLevel.WebsiteAdmin)
                {
                    users = await (from user in _dbContext.ADUsers
                                   join userrole in _dbContext.UserRoles on user.UserId equals userrole.UserId
                                   where  userrole.RoleId != PredefinedValues.AdminRoleId && (user.DefaultWebsiteId == websiteId || user.DefaultWebsiteId == PredefinedValues.AllWebsiteId)
                                   select user).ExcludeDeletion().AsNoTracking().GetQuery(filter).ToPagedCollectionAsync<ADUser, UserDto>(filter, UserProjection.ExternalUserDto);
                }
                else
                    users = await _dbContext.ADUsers.ExcludeDeletion().AsNoTracking().Where(o => o.CreatedBy == "").AsNoTracking().GetQuery(filter).ToPagedCollectionAsync<ADUser, UserDto>(filter, UserProjection.ExternalUserDto);
            }

            return users;
        }

        public async Task<List<UserDto>> GetExternalUsers(IUserProfile requestor, Guid websiteId, IFilter filter)
        {
            List<UserDto> users = new List<UserDto>();
            var permissionLevel = await GetPermissionLevel(requestor, websiteId);

            if (permissionLevel == EnumPermissionLevel.SystemAdmin)
                users = await _dbContext.ADUsers.ExcludeDeletion().AsNoTracking().GetQuery(filter).Where(o => o.DefaultWebsiteId == websiteId || o.DefaultWebsiteId == PredefinedValues.AllWebsiteId).Select<ADUser, UserDto>(UserProjection.ExternalUserDto).ToListAsync();
            else if (permissionLevel == EnumPermissionLevel.WebsiteAdmin)
            {
                users = await (from user in _dbContext.ADUsers
                               join userrole in _dbContext.UserRoles on user.UserId equals userrole.UserId
                               where userrole.RoleId != PredefinedValues.AdminRoleId && (user.DefaultWebsiteId == websiteId)
                               select user).ExcludeDeletion().AsNoTracking().GetQuery(filter).Select<ADUser, UserDto>(UserProjection.ExternalUserDto).ToListAsync();
            }
            //else
                //users = await _dbContext.ADUsers.ExcludeDeletion().AsNoTracking().Where(o => o.CreatedBy == requestor.UserId).AsNoTracking().GetQuery(filter).Select<ADUser, UserDto>(UserProjection.ExternalUserDto).ToListAsync();

            return users;
        }

        public async Task<UserDto> GetUser(Guid id,Guid websiteId,IUserProfile userProfile) {
            UserDto user = id == Guid.Empty ? new UserDto() { DefaultWebsiteId = websiteId} : null;
            user = user?? await _dbContext.Users.GetById(id).ExcludeDeletion().Select(UserProjection.UserDto).FirstOrDefaultAsync<UserDto>();
            
            if (user == null)
                throw new NotFoundCustomException("Record is not found");

            var permssionLevel = await GetPermissionLevel(userProfile, websiteId);

            if (permssionLevel == EnumPermissionLevel.User || permssionLevel == EnumPermissionLevel.WebsiteAdmin && user.DefaultWebsiteId != websiteId)
                throw new NotFoundCustomException("Record is not found");

            user.WebsiteId = websiteId;
            user.RoleIds = await _dbContext.UserRoles.GetByPermission(permssionLevel, websiteId, user.UserId).Select(o => o.RoleId.ToString().ToLower()).ToListAsync<string>();

            user.SFASettings = await _dbContext.V_UserSFASettings.Where(o => o.UserId == user.UserId)
                .Select(o => new MFASettingDto()
                {
                    Id= o.SettingId.ToString(),
                    UserId = o.UserId,
                    ProviderId = o.ProviderId,
                    Name = o.ProviderName,
                    Secret = o.Secret == null ? "" : o.Secret
                }).ToListAsync<MFASettingDto>();

            user.SFASettings = user.SFASettings.DistinctBy(o => o.ProviderId).ToList();
            return user;
        }

        public async Task<UserDto> GetExternalUser(Guid id, Guid websiteId, IUserProfile userProfile)
        {
            var permssionLevel = await GetPermissionLevel(userProfile, websiteId);
            var user = await _dbContext.ADUsers.ExcludeDeletion().GetById(id).Select(UserProjection.ExternalUserDto).FirstOrDefaultAsync<UserDto>();
            if (user == null)
                throw new NotFoundCustomException("Record is not found");

            if (permssionLevel == EnumPermissionLevel.User)
                throw new NotFoundCustomException("Record is not found");

            user.WebsiteId = websiteId;
            user.RoleIds = await _dbContext.UserRoles.GetByPermission(permssionLevel, websiteId, user.UserId).Select(o => o.RoleId.ToString().ToLower()).ToListAsync<string>();

            user.SFASettings = await _dbContext.V_UserSFASettings.Where(o => o.UserId == user.UserId)
                .Select(o => new MFASettingDto()
                {
                    Id = o.SettingId.ToString(),
                    UserId = o.UserId,
                    ProviderId = o.ProviderId,
                    Name = o.ProviderName,
                    Secret = o.Secret == null ? "" : o.Secret
                }).ToListAsync<MFASettingDto>();

            user.SFASettings = user.SFASettings.DistinctBy(o => o.ProviderId).ToList();
            return user;
        }

        public async Task<UserDto> SaveUser(UserDto userDto,IUserProfile profile) {
            var user = await _dbContext.Users.CreateOrUpdateAsync(userDto,profile);
            var isAdmin = IsSystemAdmin(profile);
            await _dbContext.UserRoles.AssignRolesToUserAsync(userDto,userDto.RoleIds,profile);
            await _dbContext.SaveChangesAsync();
            userDto.Id = user.Id;
            return userDto;
        }

        public async Task<UserDto> SaveExternalUser(UserDto userDto,IUserProfile profile)
        {
            var user = await _dbContext.ADUsers.CreateOrUpdateAsync(userDto,profile);
            await _dbContext.UserRoles.AssignRolesToUserAsync(userDto,userDto.RoleIds,profile);
            await _dbContext.SaveChangesAsync();
            userDto.Id = user.Id;
            return userDto;
        }

        public async Task DeleteUser(Guid id, IUserProfile user)
        {
            var result = await _dbContext.Users.DeleteAsync(id,user);
            if (result == null)
                return;

            var userRoles = await _dbContext.UserRoles.Where(o => o.UserId == result.UserId).ToListAsync();
            _dbContext.UserRoles.RemoveRange(userRoles);

            var dashboardSharedUsers = await _dbContext.DashboardSharedUsers.Where(o => o.UserId == result.UserId).ToListAsync();
            _dbContext.DashboardSharedUsers.RemoveRange(dashboardSharedUsers);

            var userOTPs = await _dbContext.UserOTPSettings.Where(o => o.UserId == result.UserId).ToListAsync();
            _dbContext.UserOTPSettings.RemoveRange(userOTPs);

            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteExternalUser(Guid id, IUserProfile user)
        {
            var result = await _dbContext.ADUsers.DeleteAsync(id, user);
            if (result == null)
                return;

            var userRoles = await _dbContext.UserRoles.Where(o => o.UserId == result.UserId).ToListAsync();
            _dbContext.UserRoles.RemoveRange(userRoles);

            var dashboardSharedUsers = await _dbContext.DashboardSharedUsers.Where(o => o.UserId == result.UserId).ToListAsync();
            _dbContext.DashboardSharedUsers.RemoveRange(dashboardSharedUsers);

            var userOTPs = await _dbContext.UserOTPSettings.Where(o => o.UserId == result.UserId).ToListAsync();
            _dbContext.UserOTPSettings.RemoveRange(userOTPs);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<Contact>> GetContacts(string userId)
        {
            return await _dbContext.Contacts.Where(o => o.UserId == userId).ToListAsync();
        }

        public async Task<Contact> GetContact(Guid id,string userId)
        {
            return await _dbContext.Contacts.Where(o => o.Id == id && o.UserId == userId).FirstOrDefaultAsync();
        }

        public async Task<Contact> SaveContact(Contact contact)
        {
            var item = await _dbContext.Contacts.CreateOrUpdateAsync(contact);
            await _dbContext.SaveChangesAsync();
            return item;
        }

        public async Task DeleteContact(Guid id,string userId)
        {
            var contact = await _dbContext.Contacts.Where(o => o.Id == id && o.UserId == userId).FirstOrDefaultAsync();
            if (contact != null)
                _dbContext.Contacts.Remove(contact);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<OrganizationDto>> GetOrganizations(Guid websiteId) {
            var result = new List<OrganizationDto>();
            result.Add(new OrganizationDto()
            {
                LocationId = websiteId.ToString(),
                Name = "Local",
                Domain = "",
                WebsiteId = websiteId
            }); ;

            var temp = await _dbContext.TrustDomains.Where(o => o.DefaultWebsiteId == websiteId || o.DefaultWebsiteId == PredefinedValues.AllWebsiteId)
                .Select<TrustDomain, OrganizationDto>(o => new OrganizationDto()
                {
                    LocationId = o.Id.ToString(),
                    Name = o.Name,
                    Domain = o.Domain,
                    WebsiteId = websiteId,
                    IsAzureADAccount = o.TenantId.HasValue
                }).ToListAsync();

            result.AddRange(temp);
            return result;
        }

        public async Task<IEnumerable<UserDto>> SearchUsersInOrganization(Guid websiteId, string fieldType, string searchText)
        {
            if (fieldType == "ID" && searchText != null)
                return await _dbContext.Users.ExcludeDeletion()
                    .Where(o => o.UserId != PredefinedValues.AdminUserId && o.UserId.Contains(searchText) && (o.DefaultWebsiteId == websiteId || o.DefaultWebsiteId == PredefinedValues.AllWebsiteId))
                    .Select<User, UserDto>(UserProjection.BasicUserDto).ToListAsync();
            else if (fieldType == "NAME" && searchText != null)
            {
                return await _dbContext.Users.ExcludeDeletion()
                  .Where(o => o.UserId != PredefinedValues.AdminUserId && o.DisplayName.Contains(searchText) && (o.DefaultWebsiteId == websiteId || o.DefaultWebsiteId == PredefinedValues.AllWebsiteId))
                  .Select<User, UserDto>(UserProjection.BasicUserDto).ToListAsync();
            }
            else
                return new List<UserDto>();
        }

        public async Task<IEnumerable<UserDto>> SearchADUserAsync(int domainId, string fieldType, string fieldValue)
        {
            var domainInfo = await _dbContext.TrustDomains.GetById(domainId).FirstOrDefaultAsync();
            if (domainInfo == null)
                return new List<UserDto>();

            var userList = DirectoryServicesUtility.FindUser(fieldType, fieldValue, domainInfo.Domain);
            var adUsers = await _dbContext.ADUsers.ExcludeDeletion().AsNoTracking().ToListAsync();
            var result = (from user in userList
                          join aduser in adUsers on user.SamAccountName equals aduser.UserId into p
                          from item in p.DefaultIfEmpty()
                          select new UserDto()
                          {
                              UserId = user.SamAccountName,
                              DisplayName = item?.DisplayName ?? (string.IsNullOrEmpty(user.DisplayName) ? user.Name : user.DisplayName),
                              Email = string.IsNullOrEmpty(user.EmailAddress)?(item?.Email??string.Empty):user.EmailAddress,
                              Company = item?.Company ?? string.Empty,
                              WebsiteId = item?.DefaultWebsiteId?? domainInfo.DefaultWebsiteId
                          }).Where(o=>o.WebsiteId==domainInfo.DefaultWebsiteId || o.WebsiteId == PredefinedValues.AllWebsiteId).ToList();
            return result;
        }

        public async Task<MFASettingDto> GenerateSecret(MFASettingDto dto, IUserProfile user) {
            var setting = await _dbContext.UserOTPSettings.CreateOrUpdateSecretAsync(dto.UserId, dto.ProviderId, user);
            await _dbContext.SaveChangesAsync();
            dto.Secret = setting.Secret;
            return dto;
        }
    }
}
 