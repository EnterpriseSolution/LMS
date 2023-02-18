using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Yokogawa.Security.OAuth.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.Graph;

namespace Yokogawa.Security.OAuth.MSGraph
{
    public class ClientCredentialMsGraphAuthenticationProvider :IAuthenticationProvider
    {
        private readonly IConfidentialClientService _confidentialClientService;
        private readonly AzureAdOptions _authSettings;

        public ClientCredentialMsGraphAuthenticationProvider(
            IOptions<AzureAdOptions> authenticationOptions,
            IConfidentialClientService confidentialClientService)
        {
            _confidentialClientService = confidentialClientService;
            _authSettings = authenticationOptions.Value;
        }

        public async Task AuthenticateRequestAsync(HttpRequestMessage request)
        {
            var app = _confidentialClientService.CreateClient();
            var result = await app.AcquireTokenForClient(_authSettings.Scope)
                 .ExecuteAsync();

            request.Headers.Authorization = new AuthenticationHeaderValue(result.TokenType, result.AccessToken);
        }
    }
}
