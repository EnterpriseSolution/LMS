using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Linq.Expressions;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.Data.Infrastructure.Extensions;

namespace Yokogawa.LMS.Platform.Core.Projections
{
    public static class PageProjection
    {
        public static Expression<Func<Page, PageDto>> PageDto {
            get {
                return (m) => new PageDto()
                {
                    Id = m.Id,
                    Url = m.Url,
                    Description = m.Description,
                    WidgetId = (m.Widget!=null ? m.WidgetId : null),
                    WidgetName = (m.Widget != null ? m.Widget.Name : ""),
                    WidgetNamespace = (m.Widget !=null?m.Widget.InstanceName: "ViewModel"),
                    IsSystemMenu = m.Widget != null ? 0 : 1,
                    WebsiteId = m.Widget != null ?  m.Widget.DefaultWebsiteId.ToString(): Guid.Empty.ToString()
                }.GetAudit<PageDto>(m);
            }
        }

    }
}
