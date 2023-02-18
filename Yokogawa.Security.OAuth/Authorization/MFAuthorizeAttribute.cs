using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Linq;
using Yokogawa.Security.OAuth.Authentication;
using Yokogawa.Security.OAuth.Identity;
using Yokogawa.Security.OAuth.Interfaces;


namespace Yokogawa.Security.AuthorizeAttributes
{
    public class MFAuthorizationAttribute : AuthorizeAttribute, IAuthorizationFilter
    {
        //IMFAuthenticationService _mfAuthenticationService;
        public MFAuthorizationAttribute() {
            
        }
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var principal = context.HttpContext.User;
            
            Claim isAuthClaim = principal.Claims.Where(o=>o.Type == CustomClaimTypes.IsOAuthAuthenticated).FirstOrDefault();
            Claim requireMFA = principal.Claims.Where(o => o.Type == CustomClaimTypes.EnableMFA).FirstOrDefault();
            bool isAuthenticated =null == isAuthClaim ? false : Convert.ToBoolean(isAuthClaim.Value);
            bool isRequireMFA =null == isAuthClaim ? false : Convert.ToBoolean(requireMFA.Value);

            if (!isAuthenticated)
            {
                var message = isRequireMFA ? "OTP is required" : "Unauthorized Request";
                context.Result = new JsonResult(message) { StatusCode = 401 };
                return;
            }
            else
                return;
        }
    }
}
