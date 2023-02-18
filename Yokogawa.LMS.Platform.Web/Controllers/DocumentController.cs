using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using Yokogawa.Security.OAuth.Interfaces;
using System.Security.Claims;
using Yokogawa.Security.OAuth.Identity;
using Yokogawa.LMS.Platform.Core.Services.Interfaces;
using Yokogawa.LMS.Platform.Core.DTOs;

namespace Yokogawa.LMS.Platform.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentController : ControllerBase
    {
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

        IDocumentService _docService;
        public DocumentController(IDocumentService docService)
        {
            _docService = docService;

        }

        [HttpDelete]
        [Route("resourcefile/{id}")]
        public async Task<IActionResult> DeleteResourceFile(Guid id)
        {
            await _docService.DeleteResourcefile(id, Identity);
            return Ok();
        }

        [HttpPost]
        [Route("resourcefiles")]
        public async Task<IEnumerable<ResourceFileDto>> PostResourceFiles([FromForm] UploadModel uploadModel)
        {
            return await _docService.SaveResourcefiles(uploadModel, Identity);
        }

        [HttpGet]
        public async Task<IActionResult> DownloadResourceFile(Guid id)
        {
            var doc = await _docService.ReadResourceFileContent(id, Identity);
            return File(doc.Content, getMediaType(doc.FileName), doc.FileName);
        }

        protected string getMediaType(string fileName)
        {
            string mediaType = "application/octet-stream";
            fileName = fileName.ToLower();
            if (fileName.EndsWith(".pdf"))
                mediaType = "application/pdf";
            else if (fileName.EndsWith(".xls"))
                mediaType = "application/vnd.ms-excel";
            else if (fileName.EndsWith(".xlsm"))
                mediaType = "application/vnd.ms-excel.sheet.macroEnabled.12";
            else if (fileName.EndsWith(".xlsx"))
                mediaType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            else if (fileName.EndsWith(".docx"))
                mediaType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            else if (fileName.EndsWith(".doc"))
                mediaType = "application/msword";
            else if (fileName.EndsWith(".ppt"))
                mediaType = "application/vnd.ms-powerpoint";
            else if (fileName.EndsWith(".pptx"))
                mediaType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
            else if (fileName.EndsWith(".csv"))
                mediaType = "text/csv";
            else if (fileName.EndsWith(".txt"))
                mediaType = "text/plain";
            else if (fileName.EndsWith(".zip"))
                mediaType = "application/zip";
            else if (fileName.EndsWith(".7z"))
                mediaType = "application/x-7z-compressed";
            else if (fileName.EndsWith(".xml "))
                mediaType = "application/xml";
            else if (fileName.EndsWith(".gif"))
                mediaType = "image/gif";
            else if (fileName.EndsWith(".png"))
                mediaType = "image/png";
            else if (fileName.EndsWith(".tiff"))
                mediaType = "image/tiff";
            else if (fileName.EndsWith(".jpeg"))
                mediaType = "image/jpeg";


            return mediaType;


        }
    
    }
}