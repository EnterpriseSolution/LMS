using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.LMS.Platform.Core.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Yokogawa.Security.OAuth.Identity;
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.LMS.Platform.Web.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PagesController : ControllerBase
    {
        IPageService _pageService;
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
        public PagesController(IPageService pageService) {
            _pageService = pageService;
            
        }

        [Route("{websiteId}")]
        public async Task<IEnumerable<PageDto>> GetPages(Guid websiteId)
        {
            return await _pageService.GetPageList(Identity, websiteId);
        }


        [Route("{websiteId}/{id}")]
        public async Task<PageDto> GetPage(string id,Guid websiteId)
        {
            id = id == "null" ? null : id;
            return await _pageService.GetPage(id,websiteId, Identity);
        }

        [HttpPost]
       // [Route("page")]
        public async Task<PageDto> PostPage(PageDto pageDto)
        {
            return await _pageService.SavePage(pageDto, Identity);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeletePage(string id)
        {
            await _pageService.DeletePage(id,Identity);
            return Ok();
        }

    }
}