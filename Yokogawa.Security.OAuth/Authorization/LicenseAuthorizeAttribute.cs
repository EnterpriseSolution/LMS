using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Configuration;
using System.Web;
using System.Net;
using System.Net.Http;
using System.Runtime.InteropServices;
using System.Reflection;

namespace Yokogawa.Security.License
{
    public class LicenseAuthorizeAttribute : AuthorizeAttribute, IAuthorizationFilter
    {
        private string _appId,_identity, fileName="license.lic";
        private IdentityType _identityType=IdentityType.DEVICE;
        private bool _isValid = false;
        private static LicenseAuthorizationProvider _provider=null;
        public Type AppType { get;set;}
        public LicenseAuthorizeAttribute(params object[] attributes)
        {

            if (_provider == null)
            {
                _appId = AppType != null ? AppType.Assembly.GetCustomAttribute<GuidAttribute>().Value : string.Empty;
                fileName = System.AppDomain.CurrentDomain.BaseDirectory + fileName;     
                _provider = new LicenseAuthorizationProvider(AppType, fileName, _identityType, _identity);
            }

            if (attributes.Length > 1)
            {
                _identityType = attributes[1] is IdentityType ? (IdentityType)attributes[1] : _identityType;
                _identity = _identityType == IdentityType.ANY && attributes.Length > 2 ? (attributes[2]).ToString() : string.Empty;
            }

            _provider.ChangeIdenitityType(_identityType, _identity);
        }


        public void OnAuthorization(AuthorizationFilterContext context)
        {
            if (_isValid)
                return;
            
            _provider.IdentityKey = _identityType == IdentityType.HOST ? context.HttpContext.Request.Host.Host : _provider.IdentityKey;
            var result = _provider.OnAuthorization();
            if (result.Code != 200)
                context.Result = new UnauthorizedResult();

            return;
        }
    }
}
