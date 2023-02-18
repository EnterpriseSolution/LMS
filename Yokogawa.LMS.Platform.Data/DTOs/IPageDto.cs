using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.LMS.Platform.Data.DTOs
{
    public interface IPageDto: IDto<string>,IAuditableDto
    {
        string Url { get; set; }
        string Description { get; set; }
        Guid? WidgetId { get; set; }
    }
}
