using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Yokogawa.Security.OAuth.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Routing;
using System.Security.Claims;
using Yokogawa.Security.OAuth.Identity;
using Microsoft.AspNetCore.Http.Features;

namespace Yokogawa.Security.OAuth.Authorization
{
    public class APIPermssionHandler: AuthorizationHandler<PermissionRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public APIPermssionHandler(IHttpContextAccessor httpContextAccessor) {
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        }
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
        {
            var endpoint = _httpContextAccessor.HttpContext.GetEndpoint();
                       
            if (endpoint == null || endpoint?.Metadata?.GetMetadata<IAllowAnonymous>() != null) {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }

            if (requirement.EnableMFA) {
                var principal = context.User;
                Claim isAuthClaim = principal.Claims.Where(o => o.Type == CustomClaimTypes.IsOAuthAuthenticated).FirstOrDefault();
       
                bool isAuthenticated = null == isAuthClaim ? false : Convert.ToBoolean(isAuthClaim.Value);
                if (!isAuthenticated) {
                    context.Fail();
                    _httpContextAccessor.HttpContext.Response.HttpContext.Features.Get<IHttpResponseFeature>().ReasonPhrase = "invalid credential";
                    return Task.CompletedTask;
                }
            }

            var user = context.User.GetUserAccount();
            if (user.APIPermissions.Count() == 0 && requirement.DefaultFullPermission)
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }

            bool hasFullAccess = user.APIPermissions.Where(o => o.ApplicationId == Guid.Empty || o.ApplicationId == requirement.ApplicationId && o.ResourceName == "*").Count() > 0;
            if (hasFullAccess)
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }

            var paths = ((RouteEndpoint)endpoint).RoutePattern.RawText.Split('/');
            var controllerActionDescriptor = endpoint?.Metadata?.GetMetadata<ControllerActionDescriptor>();
            var controllerName = controllerActionDescriptor.ControllerName;
            var actionName = controllerActionDescriptor.ActionName;
            var permissions = user.APIPermissions.Where(o => o.ResourceName.StartsWith(controllerName) && o.ApplicationId == requirement.ApplicationId);
            var authorizedResources = new List<string>();

            if (actionName.ToLower() == "get"||actionName.ToLower()=="post" && paths[paths.Length-1].ToLower()=="list")
                authorizedResources = permissions.Where(o => o.AllowRead).Select(o => o.ResourceName).ToList();
            else
                authorizedResources = permissions.Where(o => o.AllowWrite).Select(o => o.ResourceName).ToList();

            var resource = string.Empty;
            bool isValid = false;
            foreach (var path in paths)
            {
                resource += (resource.Length>0? "/":"")+path.ToString();
                isValid = authorizedResources.Contains(resource);
                if (isValid)
                    break;
            }

            if (isValid)
            {
                context.Succeed(requirement);
            }
            else {
                context.Fail();
                _httpContextAccessor.HttpContext.Response.HttpContext.Features.Get<IHttpResponseFeature>().ReasonPhrase = "No permission";
            }
            
            
            return Task.CompletedTask;
        }

        
    }
}
