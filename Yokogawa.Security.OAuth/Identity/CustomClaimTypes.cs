using System;
using System.Collections.Generic;
using System.Text;

namespace Yokogawa.Security.OAuth.Identity
{
    public static class CustomClaimTypes
    {
        public const string UserId = "as:username";
        public const string DisplayName = "as:displayname";
        public const string Company = "as:company";
        public const string ClientSecret = "as:client_secret";
        public const string ClientId = "as:client_id";
        public const string IsOAuthAuthenticated = "as:isOAuthAuthenticated";
        public const string MFAProviders = "as:MFAProviders";
        public const string EnableMFA = "as:requireMFA";
        public const string EnableRefreshToken = "as:enableRefreshToken";
        public const string Domain = "as:domain";
        public const string TenantId = "as:tenantId";
        public const string WebsiteId = "as:websiteId";
        public const string Websites = "as:websites";
        public const string RefreshToken = "as:refresh_token";
        public const string RefreshTokenId = "as:refresh_tokenId";
        public const string APIPermissions = "as:apipermissions";
    }

    public static class AzureAdClaimTypes
    {
        public const string ObjectId = "http://schemas.microsoft.com/identity/claims/objectidentifier";

        public const string Scope = "http://schemas.microsoft.com/identity/claims/scope";

        public const string Name = "http://schemas.microsoft.com/identity/claims/name";
    }
}
