using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yokogawa.Security.OAuth.Identity;
using Yokogawa.Security.OAuth.MSGraph;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace Yokogawa.LMS.Platform.AzureAPIs.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IGraphApiService _graphApiService;

        public UsersController(IGraphApiService graphApiService)
        {
            _graphApiService = graphApiService;
        }

        [HttpGet("me")]
        public async Task<UserProfile> Profile()
        {
            var user = await _graphApiService.GetUserProfileAsync();
            return new UserProfile()
            {
                UserId = user.Id,
                UserName = user.DisplayName,
                Company = user.CompanyName,
                Email = user.Mail
            };
        }

        [HttpGet("search/{term}")]
        public async Task<IEnumerable<UserProfile>> Search(string term)
        {
            var userList = await _graphApiService.SearchUsersAsync(term, 10);
            return userList.Select<User, UserProfile>(o => new UserProfile() { 
                UserId = o.Id,
                UserName = o.DisplayName,
                Company = o.CompanyName,
                Email = o.Mail
            });
        }

    }
}