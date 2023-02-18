using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.Security.OAuth.Interfaces;
using System.IO;

namespace Yokogawa.LMS.Platform.Core.Services.Interfaces
{
    public interface IDocumentService
    {
        Task DeleteResourcefile(Guid id, IUserProfile user);
        Task<IEnumerable<ResourceFileDto>> SaveResourcefiles(UploadModel uploadModel, IUserProfile user);
        Task<ResourceFileDto> ReadResourceFileContent(Guid id, IUserProfile user);



    }
}
