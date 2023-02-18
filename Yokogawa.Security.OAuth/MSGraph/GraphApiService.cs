using Microsoft.Graph;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Yokogawa.Security.OAuth.Configuration;

namespace Yokogawa.Security.OAuth.MSGraph
{
    public interface IGraphApiService
    {
        Task<User> GetUserProfileAsync();
        Task<List<User>> SearchUsersAsync(string search, int limit);
    }

    public class GraphApiService : IGraphApiService
    {
        private readonly IAuthenticationProvider _msGraphAuthenticationProvider;
        private readonly AzureAdOptions _authSettings;
        public GraphApiService(IAuthenticationProvider authenticationProvider, IOptions<AzureAdOptions> authenticationOptions)
        {
            _msGraphAuthenticationProvider = authenticationProvider;
            _authSettings = authenticationOptions.Value;
        }

        public async Task<User> GetUserProfileAsync()
        {
            var client = new GraphServiceClient(_authSettings.GraphApiUrl, _msGraphAuthenticationProvider);
            return await client.Me.Request().GetAsync();
        }

        public async Task<List<User>> SearchUsersAsync(string search, int limit)
        {
            var client = new GraphServiceClient(_authSettings.GraphApiUrl,_msGraphAuthenticationProvider);
            var users = new List<User>();

            var currentReferencesPage = await client.Users
                .Request()
                .Top(limit)
                .Filter($"startsWith(displayName, '{search}') or startswith(mail, '{search}')")
                .GetAsync();

            users.AddRange(currentReferencesPage);

            return users;
        }
    }
}
