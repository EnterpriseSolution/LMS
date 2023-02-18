using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Yokogawa.LMS.Platform.Core.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Yokogawa.Security.OAuth.Identity;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.Data.Infrastructure.Utils;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.Security.OAuth.Configuration;

namespace Yokogawa.LMS.Platform.Web.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        IClientService _clientService;
        IUserProfile _identity;
        IUserProfile Identity
        {
            get
            {
                if (_identity == null)
                    _identity = this.HttpContext.User.GetUserAccount();
                return _identity;
            }
        }

        public ClientsController(IClientService clientService)
        {
            _clientService = clientService;
        }

        public async Task<IEnumerable<ClientDto>> GetClientList()
        {
            return await _clientService.GetClientList(Identity);
        }

        [Route("XMLClients")]
        public async Task<IActionResult> GetClients()
        {
            var clients =await _clientService.GetClients(Identity);
            string xml = MappingUtil.GetXElements<ClientDto>(clients, "clients").ConvertToXML();
            return Ok(xml);
        }

        [Route("{id}")]
        public async Task<ClientDto> GetClient(string id)
        {
            Guid clientId;
            if (!Guid.TryParse(id, out clientId))
                clientId = Guid.Empty;
           return await _clientService.GetClient(clientId, Identity);

        }

        [HttpPost]
        //[Route("client")]
        public async Task<ClientDto> PostClient(ClientDto clientDto) {
            return await _clientService.SaveClient(clientDto, Identity);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteClient(string id) {
            Guid clientId = Guid.Parse(id);
            await _clientService.DeleteClient(clientId, Identity);
            return Ok("Deleted");
        }
    }
}