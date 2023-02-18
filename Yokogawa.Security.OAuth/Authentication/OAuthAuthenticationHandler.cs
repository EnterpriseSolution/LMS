using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Yokogawa.Security.OAuth.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Microsoft.Extensions.Primitives;
using Yokogawa.Security.OAuth.Identity;
using Yokogawa.Security.OAuth.Utils;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Protocols;

namespace Yokogawa.Security.OAuth.Authentication
{
    public class OAuthAuthenticationHandler: AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly IOAuthAuthenticationService _authenticationService;
        private string _failReason = string.Empty;
        //private TokenValidationParameters _parameters;

        public OAuthAuthenticationHandler(IOptionsMonitor<AuthenticationSchemeOptions> options, ILoggerFactory logger,  
            UrlEncoder encoder,
            ISystemClock clock, 
            IOAuthAuthenticationService authenticationService) : base(options, logger, encoder, clock)
        {
            _authenticationService = authenticationService;
           // _parameters = parameters;
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            var endpoint = Context.GetEndpoint();
            if (endpoint?.Metadata?.GetMetadata<IAllowAnonymous>() != null)
                return AuthenticateResult.NoResult();

            if (endpoint == null && Context.Request.Path.Value != "/token")
                return AuthenticateResult.NoResult();

            if (endpoint!=null && !Request.Headers.ContainsKey("Authorization"))
                return AuthenticateResult.Fail("Missing Authorization Header");           
            try
            {
                var oauthContext = new OAuthGrantCredentialContext(Context);
                AuthenticationProperties props = null;

                if (endpoint == null)
                {
                    _failReason = await validateClient(oauthContext);
                    if (!string.IsNullOrEmpty(_failReason))
                        return AuthenticateResult.Fail(_failReason);

                    switch (oauthContext.ContextGrantType)
                    {
                        case AuthenticationGrantType.CLIENT_CREDENTIAL:
                            _failReason = await grantClientCredential(oauthContext);
                            break;
                        case AuthenticationGrantType.PASSWORD:
                            _failReason = await grantResourceOwner(oauthContext);
                            break;
                        case AuthenticationGrantType.REFRESH_TOKEN:
                            _failReason= await grantRefreshToken(oauthContext);
                            break;
                        case AuthenticationGrantType.OTP:
                            _failReason = await validateAccessToken(oauthContext);
                            break;
                        case AuthenticationGrantType.Azure_Token:
                            _failReason = await validateAzureADToken(oauthContext);
                            break;
                    }

                    if (!string.IsNullOrEmpty(_failReason))
                        return AuthenticateResult.Fail(_failReason);

                    IClientBaseDto client = oauthContext.Get<IClientBaseDto>(AuthenticationKeyName.Client);
            
                    DateTime now = DateTime.UtcNow;
                    props = oauthContext.Get<AuthenticationProperties>(AuthenticationKeyName.AuthenticationProperties);
                    props.IssuedUtc = DateTime.SpecifyKind(now, DateTimeKind.Utc);
                    props.ExpiresUtc = DateTime.SpecifyKind(now.AddMinutes(client.TokenLifeTime), DateTimeKind.Utc);
                }
                else {
                    _failReason = await validateAccessToken(oauthContext);
                    if (!string.IsNullOrEmpty(_failReason))
                        return AuthenticateResult.Fail(_failReason);
                    
                    props = oauthContext.Get<AuthenticationProperties>(AuthenticationKeyName.AuthenticationProperties);
                }

                IEnumerable<Claim> claims = oauthContext.Get<IEnumerable<Claim>>(AuthenticationKeyName.Claims);
                var isOAuthAuthenticated = props.GetParameter<bool>(CustomClaimTypes.IsOAuthAuthenticated);
                var identity = new ClaimsIdentity(claims, Scheme.Name);
                var authenticatedClaim = identity.Claims.Where(o => o.Type == CustomClaimTypes.IsOAuthAuthenticated).FirstOrDefault();

                if (authenticatedClaim != null)
                    identity.RemoveClaim(authenticatedClaim);
                
                identity.AddClaim(new Claim(CustomClaimTypes.IsOAuthAuthenticated, isOAuthAuthenticated.ToString()));
                var principal = new ClaimsPrincipal(identity);
                var ticket = new AuthenticationTicket(principal, props, Scheme.Name);
                oauthContext.Validate(ticket);
                return AuthenticateResult.Success(ticket);

            }
            catch
            {
                return AuthenticateResult.Fail("Invalid Authorization Header");
            }
 
        }

        protected override async Task HandleChallengeAsync(AuthenticationProperties properties)
        {
            Response.StatusCode = 401;
            string response = JsonConvert.SerializeObject(new 
            {
                Message = _failReason
            });
            
            Response.ContentType = "application/json";
            Response.ContentLength = response.Length;

            Response.HttpContext.Features.Get<IHttpResponseFeature>().ReasonPhrase = "Invalid Credential";
            await Response.WriteAsync(response);
        }

        private async Task<string> validateClient(OAuthGrantCredentialContext oauthContext)
        {
            IClientBaseDto client = null;
            var clientId = await oauthContext.GetParameterAsync("client_id");
            if (string.IsNullOrEmpty(clientId))
                return "Invalid client Id";

            if (oauthContext.ContextGrantType == AuthenticationGrantType.INVALID)
                return "Grant Type is missing";
       
            try {
             
                client = await _authenticationService.GetClientAsync(clientId);

                if (client != null)
                    Context.Response.Headers.Add("Access-Control-Allow-Origin", new[] { client.AllowOrignal });
                else
                    return "Authentication fails";

                oauthContext.Set<IClientBaseDto>(AuthenticationKeyName.Client, client);
            }
            catch (Exception ex) {
                return "invalid client (" + ex.Message+")";
            }
            return string.Empty;
        }

        private async Task<string> validateAccessToken(OAuthGrantCredentialContext oauthContext) {

            string error = string.Empty;
            StringValues authField;
            if (!Request.Headers.TryGetValue("Authorization", out authField))
                return "Missing Authorization Header";

            var authHeader = AuthenticationHeaderValue.Parse(authField);
            var access_token = authHeader.Parameter;
            try
            {
                
                JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
                if (!handler.CanReadToken(access_token))
                    return "Authentication fails";
                
                JwtSecurityToken token = handler.ReadJwtToken(access_token);
                //verify audience
                if (token.Audiences.Count() == 0)
                    return "Authentication Fails";

                IClientBaseDto client = await _authenticationService.GetClientAsync(token.Audiences.First());

                if (client == null)
                    return "Authentication Fails";

                //verify issuer
                var issuer = $"{Context.Request.Scheme}://{Context.Request.Host.Value}/{Context.Request.PathBase.Value}";
            
                //verify token
                var validationParameters = new TokenValidationParameters
                {
                    RequireExpirationTime = true,
                    RequireSignedTokens = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,                    
                    IssuerSigningKey = new SymmetricSecurityKey(Base64UrlTextEncoder.Decode(client.Secret)),
                    ValidateIssuer = client.EnableSSO,
                    ValidIssuer = issuer,
                    ValidateAudience = true,
                    ValidAudience = client.ClientId,
                };

                SecurityToken securityToken = null;
                var principle = handler.ValidateToken(access_token, validationParameters,out securityToken);
                
                //verify sso
              /*  if (!client.EnableSSO)
                {
                    issuer = issuer.TrimEnd('/');
                    if (!token.Issuer.Equals(issuer, StringComparison.OrdinalIgnoreCase))
                        return "Authentication Fails";
                }*/

                //verify expiry date
                /*DateTime checkedTime = DateTime.UtcNow;
                if (securityToken.ValidFrom > checkedTime || checkedTime > securityToken.ValidTo)
                    return "Authentication Fails";*/

                var oauthClaim = principle.Claims.FirstOrDefault(o => o.Type == CustomClaimTypes.IsOAuthAuthenticated);

                if (oauthClaim == null)
                    return "Invalid token";

                ClaimsIdentity identity = new ClaimsIdentity(principle.Claims);
                if (!Convert.ToBoolean(oauthClaim.Value))
                {
                    StringValues optTypeField, pincodeField;
                    if (Request.Headers.TryGetValue(TFAHeader.OTP_TYPE_HEADER, out optTypeField))
                    {
                        var optHeader = AuthenticationHeaderValue.Parse(optTypeField);

                        if (Request.Headers.TryGetValue(TFAHeader.OTP_HEADER, out pincodeField))
                        {
                            var pincodeHeader = AuthenticationHeaderValue.Parse(pincodeField);
                            var pincode = pincodeHeader.Scheme;
                            if (string.IsNullOrEmpty(pincode))
                                return "Authentication fails";

                            var userClaim = principle.Claims.FirstOrDefault(o => o.Type == ClaimTypes.Name); 
                            if (userClaim == null)
                                return "Invalid User";
                            var user = await _authenticationService.ValidateOTPAsync(userClaim.Value, optHeader.Scheme, pincode);

                            if (user == null)
                                return "Invalid Pin code";

                            identity.AddClaim(new Claim(CustomClaimTypes.DisplayName, user.UserName));
                            identity.AddClaim(new Claim(ClaimTypes.Email, user.Email));
                            identity.AddClaim(new Claim(CustomClaimTypes.Company, user.Company));
                            identity.AddClaim(new Claim(ClaimTypes.Role, user.Roles));

                        }
                        else
                            return "Authentication fails";
                    }
                    else
                        return "One time password is required";
                }

        
                oauthContext.Set<IEnumerable<Claim>>(AuthenticationKeyName.Claims, identity.Claims);

                AuthenticationProperties props = new AuthenticationProperties(new Dictionary<string, string> { }, new Dictionary<string, object> {
                              {
                                 AuthenticationKeyName.Client, client
                              },
                              {
                                 CustomClaimTypes.IsOAuthAuthenticated, true
                              }
                        });


                oauthContext.Set<AuthenticationProperties>(AuthenticationKeyName.AuthenticationProperties, props);
            }
            catch(Exception ex) {
                return "Validation fails (" + ex.Message + ")";
            }
            return string.Empty;
        }

        private async Task<string> validateAzureADToken(OAuthGrantCredentialContext oauthContext) {

            string error = string.Empty;
            StringValues authField;
            if (!Request.Headers.TryGetValue("Authorization", out authField))
                return "Missing Authorization Header";

            var authHeader = AuthenticationHeaderValue.Parse(authField);
            var access_token = authHeader.Parameter;

            try {
                var clientId = await oauthContext.GetParameterAsync("client_id");
            
                IClientBaseDto client = await _authenticationService.GetClientAsync(clientId);

                if (client == null)
                    return "Authentication fails";

                /*JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
                if (!handler.CanReadToken(access_token))
                    return "Authentication fails";

                JwtSecurityToken token = handler.ReadJwtToken(access_token);
                var tidClaim = token.Claims.Where(o => o.Type == "tid").FirstOrDefault();
                if (tidClaim == null)
                    return "Authentication fails";

                var audClaim = token.Claims.Where(o => o.Type == "aud").FirstOrDefault();
                if (audClaim == null)
                    return "Authentication fails";

                var appList = await _authenticationService.GetAppsByTenantIdAsync(tidClaim.Value);
                if (appList.Count()==0)
                    return "Authentication fails";

                var issClaim = token.Claims.Where(o => o.Type == "iss").FirstOrDefault();
                if (issClaim == null)
                    return "Authentication fails";

                var audiences = appList.Select(o=>o.ToString()).ToList();
                if (!appList.Contains(Guid.Parse(audClaim.Value)))
                    return "Authentication fails";

                var authority = issClaim.Value;
                 var stsDiscoveryEndpoint = $"{authority}/.well-known/openid-configuration";
                 var configManager = new ConfigurationManager<OpenIdConnectConfiguration>(stsDiscoveryEndpoint, new OpenIdConnectConfigurationRetriever());
                 var config = await configManager.GetConfigurationAsync();
                 var issuer = config.Issuer;

                 //verify token
                 var validationParameters = new TokenValidationParameters
                 {
                     ValidIssuer = issuer,
                     ValidAudiences = audiences,
                     IssuerSigningKeys = config.SigningKeys
                 };
                 
                 SecurityToken securityToken = null;
                 var principle = handler.ValidateToken(access_token, validationParameters, out securityToken);
                 var user = await _authenticationService.AuthenticateAzureADUserAsync(token.Claims);
                 */
                
                var user = await _authenticationService.AuthenticateAzureADUserAsync(access_token);

                if (user == null)
                    return "Authentication fails";

                bool isEnableMFA = false;           

                var claims = new[] {
                 new Claim(ClaimTypes.Name, user.UserId),
                 new Claim(CustomClaimTypes.EnableMFA,isEnableMFA.ToString()),
                 //new Claim(CustomClaimTypes.TenantId,tidClaim.Value),
                new Claim(CustomClaimTypes.MFAProviders,"[]"),
                 new Claim(CustomClaimTypes.APIPermissions, JArray.FromObject(user.APIPermissions).ToString())
                };

                ClaimsIdentity identity = new ClaimsIdentity(claims);
                if (!isEnableMFA)
                {
                    identity.AddClaim(new Claim(CustomClaimTypes.DisplayName, user.UserName));
                    identity.AddClaim(new Claim(ClaimTypes.Email, user.Email));
                    identity.AddClaim(new Claim(CustomClaimTypes.Company, user.Company));
                    identity.AddClaim(new Claim(ClaimTypes.Role, user.Roles));
                }

  
                oauthContext.Set<IEnumerable<Claim>>(AuthenticationKeyName.Claims, identity.Claims);

                AuthenticationProperties props = new AuthenticationProperties(new Dictionary<string, string> {
                    { CustomClaimTypes.UserId, user.UserId},
                    { CustomClaimTypes.DisplayName,user.UserName},
                    //{ CustomClaimTypes.TenantId,tidClaim.Value}

                }, new Dictionary<string, object> {
                    {
                        AuthenticationKeyName.Client, client
                    },
                     {
                        CustomClaimTypes.IsOAuthAuthenticated, (!isEnableMFA)
                    }
                });
                oauthContext.Set<AuthenticationProperties>(AuthenticationKeyName.AuthenticationProperties, props);
            }
            catch (Exception ex) {
                return "Validation fails (" + ex.Message + ")";
            }
            return string.Empty;
        }
        private async Task<string> grantClientCredential(OAuthGrantCredentialContext oauthContext) {

            IClientBaseDto client = oauthContext.Get<IClientBaseDto>(AuthenticationKeyName.Client);

            if (client == null || oauthContext.ContextGrantType != AuthenticationGrantType.CLIENT_CREDENTIAL)
                return "Authentication fails";

            var secret = await oauthContext.GetParameterAsync("client_secret");

            if (string.IsNullOrEmpty(secret))
                return "Authenication fails";

            if (client.Secret != secret)
                return "Authenication fails";

            IEnumerable<Claim> claims = new[] {
                    new Claim(ClaimTypes.Name,client.ClientId),
                    new Claim(CustomClaimTypes.DisplayName,client.Name)
            };

            oauthContext.Set<IEnumerable<Claim>>(AuthenticationKeyName.Claims, claims);

            AuthenticationProperties props = new AuthenticationProperties(new Dictionary<string, string> { 
                    {
                        CustomClaimTypes.ClientId, client.ClientId
                    }
                }, new Dictionary<string, object> {
                    {
                        AuthenticationKeyName.Client, client
                    },
                    {
                        CustomClaimTypes.IsOAuthAuthenticated, true
                    }
                });
            oauthContext.Set<AuthenticationProperties>(AuthenticationKeyName.AuthenticationProperties, props);
            return string.Empty;
        }

        private async Task<string> grantResourceOwner(OAuthGrantCredentialContext oauthContext)
        {
            IClientBaseDto client = oauthContext.Get<IClientBaseDto>(AuthenticationKeyName.Client);

            if (client == null || oauthContext.ContextGrantType != AuthenticationGrantType.PASSWORD)
                return "Invalid Authentication Type";

            var username = await oauthContext.GetParameterAsync("username");
            var password = await oauthContext.GetParameterAsync("password");
            var domain = await oauthContext.GetParameterAsync("domain");

            IUserProfile user = null;
            try {
                if (string.IsNullOrEmpty(domain))
                    user = await _authenticationService.AuthenticateAsync(username, password);
                else
                    user = await _authenticationService.AuthenticateAsync(username, password, domain);

                if (user == null)
                    return "Authentication fails";

                user.SFASettings = user.SFASettings.Where(o => o.ClientId.ToLower() == client.ClientId.ToLower()).ToList();
                bool isEnableMFA = client.Enable2FA && user.SFASettings.Count() > 0;
                var userOTPSettings = user.SFASettings.Select(o => new {
                    Name=o.Name,
                    Url = o.Url,
                    Id = o.ProviderId
                }).ToList();

                var claims = new[] {
                 new Claim(ClaimTypes.Name, user.UserId),
                 new Claim(CustomClaimTypes.EnableMFA,isEnableMFA.ToString()),
                 new Claim(CustomClaimTypes.Domain,domain),
                 new Claim(CustomClaimTypes.MFAProviders,JArray.FromObject(userOTPSettings).ToString()),
                 new Claim(CustomClaimTypes.APIPermissions, JArray.FromObject(user.APIPermissions).ToString())
                };
                
                ClaimsIdentity identity = new ClaimsIdentity(claims);
                if (!isEnableMFA)
                {
                    identity.AddClaim(new Claim(CustomClaimTypes.DisplayName, user.UserName));
                    identity.AddClaim(new Claim(ClaimTypes.Email, user.Email));
                    identity.AddClaim(new Claim(CustomClaimTypes.Company, user.Company));
                    identity.AddClaim(new Claim(ClaimTypes.Role, user.Roles));
                }

                //oauthContext.Set<bool>(CustomClaimTypes.EnableMFA, isEnableMFA);
                oauthContext.Set<IEnumerable<Claim>>(AuthenticationKeyName.Claims, identity.Claims);

                AuthenticationProperties props = new AuthenticationProperties(new Dictionary<string, string> {
                    { CustomClaimTypes.UserId, user.UserId},
                    { CustomClaimTypes.DisplayName,user.UserName}

                }, new Dictionary<string, object> {
                    {
                        AuthenticationKeyName.Client, client
                    },
                     {
                        CustomClaimTypes.IsOAuthAuthenticated, (!isEnableMFA)
                    }
                });
                oauthContext.Set<AuthenticationProperties>(AuthenticationKeyName.AuthenticationProperties, props);
            }
            catch (Exception ex) {
                return "Invalid user:"+ex.Message;
            }
           

            return string.Empty;
        }

        private async Task<string> grantRefreshToken(OAuthGrantCredentialContext oauthContext)
        {
            string error = string.Empty;
            try
            {
                if (oauthContext.ContextGrantType != AuthenticationGrantType.REFRESH_TOKEN)
                    return string.Empty;

                IClientBaseDto client = oauthContext.Get<IClientBaseDto>(AuthenticationKeyName.Client);

                if (client == null)
                    return "Authentication fails";
     
                var refresh_token = await oauthContext.GetParameterAsync("refresh_token");

                if (string.IsNullOrEmpty(refresh_token))
                    return "Authentication fails";

                var refreshTokenId = EncryptUtility.GetHash(refresh_token);
                IRefreshTokenDto refreshToken = await _authenticationService.GetRefreshTokenAsync(refreshTokenId);

                JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();

                if (refreshToken == null || !handler.CanReadToken(refreshToken.ProtectedTicket) || refreshToken.ExpiresUtc < DateTime.UtcNow)
                    return "Authentication fails";

                JwtSecurityToken token = handler.ReadJwtToken(refreshToken.ProtectedTicket);

                
                if (token.Audiences.Count() == 0 || token.Audiences.First() != client.ClientId)
                    return "Invalid Client";

                oauthContext.Set<IEnumerable<Claim>>(AuthenticationKeyName.Claims, token.Claims);

                AuthenticationProperties props = new AuthenticationProperties(new Dictionary<string, string> { }, new Dictionary<string, object> {
                    {
                        AuthenticationKeyName.Client, client
                    },
                    {
                        CustomClaimTypes.IsOAuthAuthenticated,true
                    },
                    {
                       CustomClaimTypes.RefreshTokenId, refreshTokenId
                    }
                });

                oauthContext.Set<AuthenticationProperties>(AuthenticationKeyName.AuthenticationProperties, props);
            }
            catch (Exception ex) {
                return ex.Message;
            }
            
            return string.Empty;
        }

    }
}

