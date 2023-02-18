using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.LMS.Platform.Data.DTOs
{
    public interface IResourceFileDto: IDto<Guid>, IAuditableDto
    {
        string FileName { get; set; }
        string FileUrl { get; set; }
        string FilePath { get; set; }
        Guid? WidgetId { get; set; }
        Guid DefaultWebsiteId { get; set; }
    }
}
