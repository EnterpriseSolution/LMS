using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Platform.Data.Entities;

namespace Yokogawa.LMS.Platform.Core.Services.Interfaces
{
    public interface IUserService
    {
        Task<UserDto> GetUserProfile(UserDto user);
        Task Signout(string userId, string clientId);
        Task<List<JSONMasterPage>> getPortals(string userId);
        Task<JSONMasterPage> GetPortal(Guid websiteId, IUserProfile user);
        Task<List<JSONMenus>> GetUserMenus(string userId, JSONMasterPage masterPage);
        Task<List<JSONDashboard>> GetDashboards(string userId, Guid websiteId);
        Task<PagedCollection<UserDto>> GetPaginatedUsers(IUserProfile requestor, Guid websiteId, IFilter filter);
        Task<PagedCollection<UserDto>> GetPaginatedExternalUsers(IUserProfile requestor, Guid websiteId, IFilter filter);
        Task<List<UserDto>> GetUsers(IUserProfile requestor,Guid websiteId, IFilter filter);
        Task<List<UserDto>> GetExternalUsers(IUserProfile requestor, Guid websiteId, IFilter filter);
        Task<UserDto> GetUser(Guid id, Guid websiteId, IUserProfile userProfile);
        Task<UserDto> GetExternalUser(Guid id, Guid websiteId, IUserProfile userProfile);
        Task<UserDto> SaveUser(UserDto user, IUserProfile profile);
        Task<UserDto> SaveExternalUser(UserDto user, IUserProfile profile);
        Task DeleteUser(Guid id, IUserProfile user);
        Task DeleteExternalUser(Guid id, IUserProfile user);
        Task<IEnumerable<Contact>> GetContacts(string userId);
        Task<Contact> GetContact(Guid id,string userId);
        Task<Contact> SaveContact(Contact contact);
        Task DeleteContact(Guid id,string userId);
        Task<IEnumerable<OrganizationDto>> GetOrganizations(Guid websiteId);
        Task<IEnumerable<UserDto>> SearchUsersInOrganization(Guid websiteId, string fieldType, string searchText);
        Task<IEnumerable<UserDto>> SearchADUserAsync(int domainId, string fieldType, string fieldValue);
        //Task<EnumPermissionLevel> GetUserPermissionLevel(IUserProfile user);
        Task<MFASettingDto> GenerateSecret(MFASettingDto dto, IUserProfile user);
        Task<bool> ChangePassword(string userId, string oldPwd, string newPwd, string domain = "");

    }
}
