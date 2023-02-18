using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Authentication;
using System.IdentityModel.Tokens.Jwt;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.Security.OAuth.Identity;
using Yokogawa.Security.OAuth.Utils;

namespace Yokogawa.Security.OAuth.Authentication
{
    public class TokenProviderMiddleware
    {
        private readonly RequestDelegate _next;
        public const string Path = "/token";
        private SigningCredentials _signingCredentials = null;

        public TokenProviderMiddleware(
          RequestDelegate next)
        {
            _next = next;
        }

        public Task Invoke(HttpContext context,IOAuthAuthenticationService oauthService)
        {
            // If the request path doesn't match, skip
            if (!context.Request.Path.Equals(Path, StringComparison.Ordinal))
            {
                return  _next(context);
            }

            /*var authenticateResult = context.AuthenticateAsync().Result;
             if (authenticateResult.Failure != null)
                 throw new UnauthorizedAccessException(authenticateResult.Failure.Message);*/

            if (!context.User.Identity.IsAuthenticated)
            {
                context.ChallengeAsync();
                return Task.CompletedTask;
            }

            // Request must be POST with Content-Type: application/x-www-form-urlencoded
            if (!context.Request.Method.Equals("POST")
           || !context.Request.HasFormContentType)
            {
                context.Response.StatusCode = 400;
                return context.Response.WriteAsync("Bad request.");
            }

            var props = context.Features.Get<AuthenticationProperties>();
            var now = props.IssuedUtc.Value.UtcDateTime;
            var client = props.GetParameter<IClientBaseDto>(AuthenticationKeyName.Client);
            var isOAuthAuthenticated = props.GetParameter<bool>(CustomClaimTypes.IsOAuthAuthenticated);
            var refreshTokenId = props.GetParameter<string>(CustomClaimTypes.RefreshTokenId);
            var isExternalLogin = props.Items.ContainsKey(CustomClaimTypes.TenantId);
            var mfaProvider = context.User.GetUserProfileByName(CustomClaimTypes.MFAProviders);
            var principle = context.User;

            var audience = client.ClientId;
            var issuer = $"{context.Request.Scheme}://{context.Request.Host.Value}/{context.Request.PathBase.Value}";
            issuer = issuer.TrimEnd('/');
            if (!string.IsNullOrEmpty(client.Secret) && _signingCredentials == null)
            {
                var keyByteArray = Base64UrlTextEncoder.Decode(client.Secret);
                var securityKey = new SymmetricSecurityKey(keyByteArray);
                _signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);
            };
                
           
            var jwt = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: principle.Claims,
                notBefore: props.IssuedUtc.Value.UtcDateTime,
                expires: props.ExpiresUtc.Value.UtcDateTime,
                signingCredentials: _signingCredentials);

            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            context.Response.ContentType = "application/json";

            if (client.EnableRefreshToken && isOAuthAuthenticated)
            {
                IRefreshTokenDto token = RefreshTokenUtility.CreateRefreshToken(principle.Identity.Name, audience, encodedJwt, props.IssuedUtc.Value.UtcDateTime, props.IssuedUtc.Value.UtcDateTime.AddMinutes(client.RefreshTokenLifeTime));
                token.OldTokenId = refreshTokenId;
                token = oauthService.SaveRefreshTokenAsync(token).Result;
                var response = new
                {
                    access_token = encodedJwt,
                    expires = props.ExpiresUtc.Value.UtcDateTime,
                    expires_in = client.TokenLifeTime,
                    refresh_token = token.Refresh_Token,
                    refresh_token_expires_in = token.ExpiresUtc,
                    require2FA = !isOAuthAuthenticated,
                    SFAProviders= mfaProvider,
                    isExternalLogin= isExternalLogin
                };


                return context.Response.WriteAsync(JsonConvert.SerializeObject(response, new JsonSerializerSettings { Formatting = Formatting.Indented }));
            }
            else
            {
                var response = new
                {
                    access_token = encodedJwt,
                    expires = props.ExpiresUtc.Value.UtcDateTime,
                    expires_in = client.TokenLifeTime,
                    require2FA = !isOAuthAuthenticated,
                    SFAProviders = mfaProvider,
                    isExternalLogin = isExternalLogin
                };

                return context.Response.WriteAsync(JsonConvert.SerializeObject(response, new JsonSerializerSettings { Formatting = Formatting.Indented }));
            }

        }
    }
}
