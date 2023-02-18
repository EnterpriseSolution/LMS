using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Yokogawa.LMS.Platform.Core.DTOs
{
    public class ResourceFileDto: AuditableDto, IResourceFileDto
    {
        public Guid Id { get; set; }
        public string FileName { get; set; }
        public string FileUrl { get; set; }
        public string FilePath { get; set; }
        public Guid? WidgetId { get; set; }
        public Guid DefaultWebsiteId { get; set; }
        public byte[] Content { get; set; }
    }
}
