using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;

namespace Yokogawa.Security.OAuth.Interfaces
{
    public interface IOAuthAuthenticationService
    {
        Task<IUserProfile> AuthenticateAsync(string username, string password);
        Task<IUserProfile> AuthenticateAsync(string username, string password, string domain);
        Task<IClientBaseDto> AuthenticateClientAsync(string clientId, string secret);
        Task<IUserProfile> ValidateOTPAsync(string userId, string providerType, string pincode);
        Task<IClientBaseDto> GetClientAsync(string clientId);
        Task<IRefreshTokenDto> SaveRefreshTokenAsync(IRefreshTokenDto token);
        Task<IRefreshTokenDto> GetRefreshTokenAsync(string id);
        Task GenerateSecret(string userId, int providerId, IUserProfile user);
        Task Signout(string userId);
        Task Signout(string userId, string client);
        Task<bool> ChangePassword(string userId, string oldPwd, string newPwd, string domain = "");
        Task<IUserProfile> AuthenticateAzureADUserAsync(IEnumerable<Claim> claims);
        Task<IUserProfile> AuthenticateAzureADUserAsync(string accessToken);
        Task<List<Guid>> GetAppsByTenantIdAsync(string tenantId);

    }
}