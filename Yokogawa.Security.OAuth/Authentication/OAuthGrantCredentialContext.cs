using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication;

namespace Yokogawa.Security.OAuth.Authentication
{
    public static class AuthenticationKeyName
    {
        public const string Claims= "claims";
        public const string AuthenticationProperties = "auth_props";
        public const string Client = "client";
    }

    public enum AuthenticationGrantType {
        INVALID = -1,
        CLIENT_CREDENTIAL=0,
        PASSWORD,
        REFRESH_TOKEN,
        OTP,
        Azure_Token//ID_TOKEN
    }
    public class OAuthGrantCredentialContext
    {
        protected HttpContext _context;
        protected Dictionary<string, string> Body { get; set; } = new Dictionary<string, string>();
        protected AuthenticationGrantType _grantType=AuthenticationGrantType.INVALID;
        public AuthenticationGrantType ContextGrantType { 
            get {
                var grantType = _context.Request.Form["grant_type"];

                if (string.IsNullOrEmpty(grantType))
                    return _grantType;

                if (grantType.ToString().ToLower() == AuthenticationGrantType.CLIENT_CREDENTIAL.ToString().ToLower())
                    _grantType = AuthenticationGrantType.CLIENT_CREDENTIAL;
                else if (grantType.ToString().ToLower() == AuthenticationGrantType.PASSWORD.ToString().ToLower())
                    _grantType = AuthenticationGrantType.PASSWORD;
                else if (grantType.ToString().ToLower() == AuthenticationGrantType.REFRESH_TOKEN.ToString().ToLower())
                    _grantType = AuthenticationGrantType.REFRESH_TOKEN;
                else if (grantType.ToString().ToLower() == AuthenticationGrantType.Azure_Token.ToString().ToLower())
                    _grantType = AuthenticationGrantType.Azure_Token;

                if (_context.Request.Headers.TryGetValue(TFAHeader.OTP_TYPE_HEADER, out grantType))
                    _grantType = AuthenticationGrantType.OTP;


                return _grantType;
            } 
        }

        private Dictionary<string, object> contextAttributes = new Dictionary<string, object>();
   
        public OAuthGrantCredentialContext(HttpContext context)
        {
            _context = context;
        }

        public async Task<string> GetParameterAsync(string key) {
            
            if (Body.Keys.Count==0)
            {
                var body = await _context.Request.ReadFormAsync();
                foreach (string name in body.Keys)
                {
                    Body[name] = body[name];
                }

                if (Body.Keys.Contains("grant_type"))
                {
                    if (Body["grant_type"].ToString().ToLower() == AuthenticationGrantType.CLIENT_CREDENTIAL.ToString().ToLower())
                        _grantType = AuthenticationGrantType.CLIENT_CREDENTIAL;
                    else if (Body["grant_type"].ToString().ToLower() == AuthenticationGrantType.PASSWORD.ToString().ToLower())
                        _grantType = AuthenticationGrantType.PASSWORD;
                    else if (Body["grant_type"].ToString().ToLower() == AuthenticationGrantType.REFRESH_TOKEN.ToString().ToLower())
                        _grantType = AuthenticationGrantType.REFRESH_TOKEN;
                    else if (Body["grant_type"].ToString().ToLower() == AuthenticationGrantType.Azure_Token.ToString().ToLower())
                            _grantType = AuthenticationGrantType.Azure_Token;
                }
                else
                    _grantType = AuthenticationGrantType.INVALID;
            }

            return Body.Keys.Contains(key)?Body[key]:string.Empty;
        }

        public void Validate(AuthenticationTicket ticket) {
            _context.Features.Set<AuthenticationProperties>(ticket.Properties);
            this.ClearParameters();
            this.ClearAttributes();

        }

        public void ClearParameters() {
            Body.Clear();
        }

        public void ClearAttributes()
        {
            contextAttributes.Clear();
        }
        public T Get<T>(string key)
        {
            if (contextAttributes.ContainsKey(key))
                return (T)contextAttributes[key];
            else
                return default(T);
        }

        public void Set<T>(string key, T value)
        {
            contextAttributes[key] = value;
        }

    }
}
