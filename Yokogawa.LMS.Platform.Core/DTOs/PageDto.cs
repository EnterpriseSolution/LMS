using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Platform.Data.DTOs;

namespace Yokogawa.LMS.Platform.Core.DTOs
{
    public class PageDto : AuditableDto,IPageDto
    {
        public string Id { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public Guid? WidgetId { get; set; }
        public string WidgetName { get; set; }
        public string WidgetNamespace { get; set; }
        public int IsSystemMenu { get; set; }
        public string WebsiteId { get; set; }
        public List<WidgetDto> Widgets { get; set; } = new List<WidgetDto>();
    }
}
