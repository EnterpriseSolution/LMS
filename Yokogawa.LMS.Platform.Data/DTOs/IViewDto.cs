using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.LMS.Platform.Data.DTOs
{
    public interface IViewDto : IDto<Guid>, IAuditableDto
    {
        string Name { get; set; }
        string Description { get; set; }
        string Model { get; set; }
        string Action { get; set; }
        string ViewModelType { get; set; }
        Guid? WidgetId { get; set; }
        Guid DefaultWebsiteId { get; set; }
        bool IsPrivate { get; set; }
    }
}
