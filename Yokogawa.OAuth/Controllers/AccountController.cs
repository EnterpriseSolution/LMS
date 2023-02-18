using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Yokogawa.LMS.Platform.Core.Services.Interfaces;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.LMS.Platform.Core.DTOs;
using System.IdentityModel.Tokens.Jwt;
using Yokogawa.Data.Infrastructure.Extensions;
using Microsoft.AspNetCore.Authentication;
using Yokogawa.Data.Infrastructure.Utils;
using Microsoft.IdentityModel.Tokens;
using Yokogawa.Security.OAuth.Identity;
using System.Security.Claims;
using Newtonsoft.Json;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.Security.AuthorizeAttributes;
using Yokogawa.Security.OAuth.Authentication;


namespace Yokogawa.OAuth.Controllers
{

    [Route("[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        IOAuthAuthenticationService _oauthService;
        public AccountController(IOAuthAuthenticationService oauthService) {
            _oauthService = oauthService;
        }

        [HttpGet]
        [MFAuthorization]
        [Authorize(Policy = "APIPermssion")]
        [Route("user")]
        public IUserProfile Get()
        {
            return this.HttpContext.User.GetUserAccount();

        }

        [HttpPost]
        [Route("signout/{clientId}")]
        public async Task Signout(string clientId) {
            var user = this.HttpContext.User.GetUserAccount();

            if (user == null)
                return;

            if (string.IsNullOrEmpty(clientId))
                await _oauthService.Signout(user.UserId);
            else
                await _oauthService.Signout(user.UserId,clientId);
        }

    }
}