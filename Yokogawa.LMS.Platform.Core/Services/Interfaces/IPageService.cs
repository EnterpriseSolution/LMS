using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.LMS.Platform.Core.Services.Interfaces
{
    public interface IPageService
    {
        Task<IEnumerable<PageDto>> GetPages(Guid websiteId);
        Task<IEnumerable<PageDto>> GetPageList(IUserProfile user, Guid websiteId);
        Task<PageDto> GetPage(string id,Guid websiteId, IUserProfile user);
        Task<PageDto> SavePage(PageDto page, IUserProfile user);
        Task DeletePage(string id,IUserProfile user);
    }
}
