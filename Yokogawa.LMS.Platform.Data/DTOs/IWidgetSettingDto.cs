using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.LMS.Platform.Data.DTOs
{
    public interface IWidgetSettingDto : IDto<Guid>, IAuditableDto
    {
        Guid RoleId { get; set; }
        Guid WidgetId { get; set; }
        Guid WebsiteId { get; set; }
        string JSONParameter { get; set; }
        string WidgetName { get; set; }
    }
}
