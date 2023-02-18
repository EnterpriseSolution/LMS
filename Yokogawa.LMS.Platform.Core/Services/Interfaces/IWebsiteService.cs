using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.LMS.Platform.Core.Services.Interfaces
{
    public interface IWebsiteService
    {
        Task<IEnumerable<WebsiteDto>> GetWebsites();
        Task<WebsiteDto> GetWebsite(Guid Id, IUserProfile user);
        Task<WebsiteDto> SaveWebsite(WebsiteDto website,IUserProfile user);
        Task DeleteWebsite(Guid id, IUserProfile user);
    }
}
