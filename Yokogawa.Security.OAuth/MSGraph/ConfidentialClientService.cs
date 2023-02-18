using Microsoft.Identity.Client;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Yokogawa.Security.OAuth.Configuration;
using System;

namespace Yokogawa.Security.OAuth.MSGraph
{
    public interface IConfidentialClientService {
        IConfidentialClientApplication CreateClient();
    }
    public class ConfidentialClientService: IConfidentialClientService
    {
        private readonly AzureAdOptions _config;
        private IConfidentialClientApplication _app;
        public ConfidentialClientService(IOptions<AzureAdOptions> authenticationOptions) {
            _config = authenticationOptions.Value;
        }
        public IConfidentialClientApplication CreateClient() {
            if (_app==null)
                _app = ConfidentialClientApplicationBuilder.Create(_config.ClientId)
                                       .WithClientSecret(_config.ClientSecret)
                                       .WithAuthority(new Uri(_config.Authority))
                                       .Build();
            return _app;
        }
    }
}
