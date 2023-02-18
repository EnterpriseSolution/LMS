using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Yokogawa.LMS.Platform.Data.DTOs;
using Microsoft.Extensions.Logging;
using Yokogawa.LMS.Platform.Data;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.LMS.Platform.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.LMS.Platform.Data.Commands;
using Yokogawa.LMS.Platform.Data.QueryObjects;
using Yokogawa.Security.OAuth.Identity;
using Yokogawa.Data.Infrastructure.Utils;
using Yokogawa.Security.OAuth.Authentication;
using Yokogawa.LMS.Platform.Core.Projections;
using System.DirectoryServices.AccountManagement;
using Yokogawa.LMS.Platform.Core;
using System.Security.Claims;
using System.Net.Http;
using Newtonsoft.Json.Linq;
using Yokogawa.Security.OAuth.Configuration;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;

namespace Yokogawa.LMS.Platform.Authentication
{
    public class OAuthAuthenticationService : IOAuthAuthenticationService
    {
        protected JoypadDBContext _dbContext;
        private readonly ILogger<OAuthAuthenticationService> _logger;
        private readonly IHttpClientFactory _clientFactory;
        private readonly AzureAdOptions _azureAdOptions;
        public OAuthAuthenticationService(JoypadDBContext dbContext, ILogger<OAuthAuthenticationService> logger, IHttpClientFactory clientFactory, IOptions<AzureAdOptions> options) {
            _logger = logger;
            _dbContext = dbContext;
            _clientFactory = clientFactory;
            _azureAdOptions = options.Value;
        }
        public async Task<IUserProfile> AuthenticateAsync(string username, string password)
        {
            password = password.Base64Encode();
            IUserProfile user = await _dbContext.Users.AsNoTracking().Where(o => o.UserId == username && o.Password == password)
             .ExcludeDeletion<User>()
             .Select<User,IUserProfile>(o=>new UserProfile() { 
                 UserId = o.UserId,
                 UserName = o.DisplayName,
                 Company = o.Company,
                 Email = o.Email
             }).FirstOrDefaultAsync<IUserProfile>();

            if (null == user)
                return user;

            string error = await _dbContext.CreateSecretAsync(user);
            if (!string.IsNullOrEmpty(error))
                _logger.LogError(error);

            await getUserProfile(user);
            return user;
        }

        public async Task<IUserProfile> AuthenticateAsync(string username, string password, string domain)
        {
            IUserProfile user = null;
            
            var domainInfo = await _dbContext.TrustDomains.Where(o => o.Name == domain).FirstOrDefaultAsync();

            if (domainInfo == null)
                return user;

            bool isADUserExist = false;
            UserPrincipal usr = DirectoryServicesUtility.ValidateUser(username, password, domainInfo.Domain);
            if (usr != null)
            {
                user = await _dbContext.ADUsers.Where(o => o.UserId == username).ExcludeDeletion<ADUser>()
                    .Select<ADUser, IUserProfile>(o => new UserProfile()
                    {
                        UserId = o.UserId,
                        UserName = o.DisplayName,
                        Company = o.Company,
                        Email = o.Email
                    }).FirstOrDefaultAsync<IUserProfile>();

                isADUserExist = user != null;
                user = user ?? new UserProfile()
                {
                    UserId = username,
                    UserName = string.IsNullOrEmpty(usr.DisplayName) ? username : usr.DisplayName,
                };
                user.UserName = !string.IsNullOrEmpty(usr.DisplayName) ? usr.DisplayName : user.UserName;
                user.Email = usr.EmailAddress == null ? user.Email : usr.EmailAddress;
            }

            if (isADUserExist)
            {
                try
                {
                    var userDto = new UserDto()
                    {
                        UserId = user.UserId,
                        DisplayName = user.UserName,
                        Email = user.Email,
                        Company = user.Company,
                        LastModifiedBy = user.UserId,
                        LastModifiedByName = user.UserName
                    };
                    await _dbContext.ADUsers.UpdateAsync(userDto);
                    await _dbContext.UserOTPSettings.CreateSecretAsync(user);
                    await _dbContext.SaveChangesAsync();

                }
                catch(Exception ex) {
                    _logger.LogError("Save AD user:" + ex.Message);
                }
                await getUserProfile(user);
            }

            return user;
        }

        public async Task<IClientBaseDto> AuthenticateClientAsync(string clientId, string secret)
        {
            IClientBaseDto clientDto = await GetClientAsync(clientId);

            if (clientDto != null)
            {
                if (clientDto.Secret == secret)
                    return clientDto;
                else
                    return null;
            }

            return clientDto;
        }

        public async Task<List<Guid>> GetAppsByTenantIdAsync(string tenantId)
        {
            var tid = Guid.Parse(tenantId);
            return await _dbContext.TrustDomains.Where(o => o.TenantId.HasValue && o.TenantId.Value == tid && o.AppId.HasValue).Select(o => o.AppId.Value).ToListAsync();
        }

        public async Task<IUserProfile> AuthenticateAzureADUserAsync(string accessToken)
        {
            IUserProfile user = null;
            string serviceUrl = _azureAdOptions.GraphApiUrl+(_azureAdOptions.GraphApiUrl.EndsWith('/') ? "" : "/") + "me";
            
            var request = new HttpRequestMessage(HttpMethod.Get, serviceUrl);
            var client = _clientFactory.CreateClient("msgraph");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var strJson = await response.Content.ReadAsStringAsync();
                JToken jsonObject = JToken.Parse(strJson);
                user = new UserProfile() { Company = ""};
                user.UserId = jsonObject.GetValue<string>("id","");
                user.UserName = jsonObject.GetValue<string>("displayName", ""); 
                user.Email = jsonObject.GetValue<string>("mail", "");
                var upn = jsonObject.GetValue<string>("userPrincipalName", "");
                if (upn.Contains('@') && string.IsNullOrEmpty(user.Email))
                    user.Email = upn;
            }

            try
            {
                if (user != null)
                {
                    UserDto userDto = new UserDto()
                    {
                        UserId = user.UserId,
                        DisplayName = user.UserName,
                        Email = user.Email,
                        Company = user.Company
                    };
                    var adUser = await _dbContext.ADUsers.UpdateAsync(userDto);
                    if (adUser != null)
                    {
                        await _dbContext.UserOTPSettings.CreateSecretAsync(user);
                        await _dbContext.SaveChangesAsync();
                        await getUserProfile(user);
                    }
                }

            }
            catch (Exception ex)
            {
                _logger.LogError("Save AD user:" + ex.Message);
            }

            return user;
        }
        public async Task<IUserProfile> AuthenticateAzureADUserAsync(IEnumerable<Claim> claims) {
            IUserProfile user = null;
            var tid = claims.Where(o => o.Type == "tid").FirstOrDefault();
            var oid = claims.Where(o => o.Type == "oid").FirstOrDefault();
            var name = claims.Where(o => o.Type == "name").FirstOrDefault();
            var email= claims.Where(o => o.Type == "email").FirstOrDefault();
            if (oid == null || name == null || tid==null)
                return user;
            var tenantId = Guid.Parse(tid.Value);
            user = new UserProfile()
            {
                UserId = oid.Value,
                UserName = name.Value,
                Email = email != null?email.Value:string.Empty,
            };

            try
            {
                var domain = await _dbContext.TrustDomains.Where(o => o.TenantId == tenantId).FirstOrDefaultAsync();
                user.Company = domain != null ? domain.Name : string.Empty;

                if (user != null) {
                    UserDto userDto = new UserDto()
                    {
                        UserId = user.UserId,
                        DisplayName = user.UserName,
                        Email = user.Email,
                        Company = user.Company
                    };
                    var adUser = await _dbContext.ADUsers.UpdateAsync(userDto);
                    if (adUser != null) {
                        await _dbContext.UserOTPSettings.CreateSecretAsync(user);
                        await _dbContext.SaveChangesAsync();
                        await getUserProfile(user);
                    }
                }
              
            }
            catch (Exception ex)
            {
                _logger.LogError("Save AD user:" + ex.Message);
            }

            return user;
        }

        private async Task<IUserProfile> getUserProfile(IUserProfile user) {
            if (null != user)
            {
                string result = string.Empty;
                var roleIds = await (from userrole in _dbContext.UserRoles
                                   join role in _dbContext.Roles on userrole.RoleId equals role.Id
                                   where userrole.UserId == user.UserId
                                   select userrole.RoleId.ToString()).AsNoTracking().ToListAsync();

                user.RoleIds = roleIds;
                user.SFASettings = await _dbContext.V_UserSFASettings.AsNoTracking().Where(o => o.UserId == user.UserId).Select(o => new MFASettingDto()
                {
                    ProviderId = o.ProviderId,
                    Name = o.ProviderName,
                    Url = o.Url,
                    HasSecret = o.HasSecret,
                    ClientId = o.ClientId.ToString()
                }).ToListAsync<IMFASettingDto>();
                //user.Require2FA = user.SFASettings.Count() > 0;

                if (user.RoleIds.Contains(PredefinedValues.AdminRoleId.ToString()))
                    user.APIPermissions.Add(new ResourcePermissionDto { ApplicationId = Guid.Empty, AllowRead = true, AllowWrite = true });
                else {
                    var websiteIds = await _dbContext.Websites.ExcludeDeletion().Where(o => o.AdminRoleId.HasValue && roleIds.Contains(o.AdminRoleId.ToString())).Select(o => o.Id).ToListAsync();
                    foreach (Guid websiteId in websiteIds)
                        user.APIPermissions.Add(new ResourcePermissionDto { ApplicationId = websiteId, ResourceName="*", AllowRead = true, AllowWrite = true });

                    if (websiteIds.Count() == 0)
                    {
                        int resourceType = Convert.ToInt32(EnumResourceType.API);
                        user.APIPermissions= await _dbContext.ModulePermissions
                            .Where(o => o.ResourceType == resourceType && (o.ReadPermission || o.WritePermission) && user.RoleIds.Contains(o.RoleId.ToString()))
                            .Select<ModulePermission, ResourcePermissionDto>(o => new ResourcePermissionDto()
                            {
                                ApplicationId = o.WebsiteId,
                                ResourceName = o.Name,
                                AllowRead = o.ReadPermission,
                                AllowWrite = o.WritePermission
                            }).ToListAsync();
                    }
                } 
            }

            return user;
        }

        public async Task<IUserProfile> ValidateOTPAsync(string userId, string providerType, string pincode)
        {
            bool isValid = false;
            var otpSetting = _dbContext.V_UserSFASettings.Where(o => o.UserId == userId && o.ProviderName == providerType).FirstOrDefault();
            if (otpSetting == null)
                return null;

            string error = string.Empty;
            isValid = MFAuthentication.Validate(otpSetting.Secret, pincode, providerType, ref error);

            if (!string.IsNullOrEmpty(error))
                throw new Exception(error);
            

            if (!isValid)
                return null;

            IUserProfile user = await _dbContext.Users.Where(o => o.UserId == userId).ExcludeDeletion<User>()
              .Select<User, IUserProfile>(o => new UserProfile()
              {
                  UserId = o.UserId,
                  UserName = o.DisplayName,
                  Company = o.Company,
                  Email = o.Email
              }).FirstOrDefaultAsync<IUserProfile>();

            await getUserProfile(user);

            return user;
        }

        public async Task<IClientBaseDto> GetClientAsync(string clientId)
        {
            var id = Guid.Parse(clientId);
            IClientBaseDto clientDto = clientDto = await _dbContext.Clients.ExcludeDeletion().GetById(id)
                .Select(ClientProjection.ClientDtoWithSecret)
                .FirstOrDefaultAsync<LMS.Platform.Data.DTOs.IClientDto>();

          return clientDto;
        }

        public async Task<IRefreshTokenDto> SaveRefreshTokenAsync(IRefreshTokenDto token)
        {
            var clientId = Guid.Parse(token.ClientId);
            _dbContext.RefreshTokens.Create(token);
            var refreshTokens = await _dbContext.RefreshTokens.GetByCredential(token.UserId, clientId).Where(o => o.Id == token.OldTokenId || o.ExpiresUtc < DateTime.UtcNow).ToListAsync();
            if (refreshTokens.Count() > 0)
                _dbContext.RefreshTokens.RemoveRange(refreshTokens);
            _dbContext.SaveChanges();
            return token;
        }

        public async Task<IRefreshTokenDto> GetRefreshTokenAsync(string id){

            return await _dbContext.RefreshTokens.GetById(id).Select(o => new RefreshTokenDto()
            {
                Id = o.Id,
                UserId = o.UserId,
                ClientId = o.ClientId.ToString(),
                ProtectedTicket = o.ProtectedTicket,
                ExpiresUtc = o.ExpiresUtc,
                IssuedUtc = o.IssuedUtc
            }).FirstOrDefaultAsync();

        }

        public async Task GenerateSecret(string userId, int providerId,IUserProfile user) {

            await _dbContext.UserOTPSettings.CreateOrUpdateSecretAsync(userId, providerId, user);
            await _dbContext.SaveChangesAsync();
        }
        public async Task Signout(string userId) {
            var refreshTokens = await _dbContext.RefreshTokens.Where(o => o.UserId == userId).ToListAsync();
            _dbContext.RefreshTokens.RemoveRange(refreshTokens);
            await _dbContext.SaveChangesAsync();
        }

        public async Task Signout(string userId,string clientId)
        {
            Guid appId = Guid.Parse(clientId);
            var refreshTokens = await _dbContext.RefreshTokens.Where(o => o.UserId == userId &&o.ClientId ==appId).ToListAsync();
            _dbContext.RefreshTokens.RemoveRange(refreshTokens);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<bool> ChangePassword(string userId,string oldPwd, string newPwd,string domain="") {
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

        
    }
}
