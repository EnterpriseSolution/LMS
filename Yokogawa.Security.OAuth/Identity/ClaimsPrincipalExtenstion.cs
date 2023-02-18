using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Principal;
using Yokogawa.Security.OAuth.Interfaces;
using Newtonsoft.Json;

namespace Yokogawa.Security.OAuth.Identity
{
    public static class ClaimsPrincipalExtenstion
    {
        public static string GetUserProfileByName(this ClaimsPrincipal userPrincipal, string claimType)
        {
            var claim = userPrincipal.Claims.FirstOrDefault(o => o.Type == claimType);
            if (claim != null)
                return claim.Value;
            else
                return string.Empty;
        }
        public static Dictionary<string, object> GetUserProfile(this ClaimsPrincipal userPrincipal)
        {
            Dictionary<string, object> result = new Dictionary<string, object>();
            if (!userPrincipal.Identity.IsAuthenticated)
                return result;
            var roleIds = userPrincipal.GetUserProfileByName(ClaimTypes.Role);
            
            result[CustomClaimTypes.UserId] = userPrincipal.Identity.Name;
            result[CustomClaimTypes.DisplayName] = userPrincipal.GetUserProfileByName(CustomClaimTypes.DisplayName);
            result[ClaimTypes.Email] = userPrincipal.GetUserProfileByName(ClaimTypes.Email);
            result[CustomClaimTypes.Company] = userPrincipal.GetUserProfileByName(CustomClaimTypes.Company);
            result[ClaimTypes.Role] =string.IsNullOrEmpty(roleIds)?null:roleIds.Split(';').ToList();
            result[CustomClaimTypes.MFAProviders] = userPrincipal.GetUserProfileByName(CustomClaimTypes.MFAProviders).ToString();
            result[CustomClaimTypes.Domain] = userPrincipal.GetUserProfileByName(CustomClaimTypes.Domain).ToString();
            result[CustomClaimTypes.APIPermissions] = JsonConvert.DeserializeObject<List<ResourcePermissionDto>>(userPrincipal.GetUserProfileByName(CustomClaimTypes.APIPermissions));
            return result;
        }

        public static IUserProfile GetUserAccount(this ClaimsPrincipal userPrincipal)
        {
            IUserProfile user = new UserProfile();

            if (!userPrincipal.Identity.IsAuthenticated)
            {
#if DEBUG
                user.UserId = "system";
                user.UserName = "system";
                user.RoleIds = new List<string>();
                return user;
#else 
                return null;
#endif

            }

            user.UserId = userPrincipal.Identity.Name;
            user.UserName = userPrincipal.GetUserProfileByName(CustomClaimTypes.DisplayName);
            user.Email = userPrincipal.GetUserProfileByName(ClaimTypes.Email);
            user.Company = userPrincipal.GetUserProfileByName(CustomClaimTypes.Company);
            user.RoleIds = userPrincipal.GetUserProfileByName(ClaimTypes.Role).Split(';').ToList();
            user.APIPermissions = JsonConvert.DeserializeObject<List<ResourcePermissionDto>>(userPrincipal.GetUserProfileByName(CustomClaimTypes.APIPermissions));

            return user;
        }
    }
}