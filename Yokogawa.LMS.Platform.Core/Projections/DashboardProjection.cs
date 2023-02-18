using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Linq.Expressions;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.Data.Infrastructure.Extensions;

namespace Yokogawa.LMS.Platform.Core.Projections
{
    public class DashboardProjection
    {
        public static Expression<Func<View, ViewDto>> ViewDto {
            get {
                return (m) => new ViewDto()
                {
                    Id = m.Id,
                    Name = m.Name,
                    Description = m.Description,
                    Widget = m.Widget == null ? "" : m.Widget.Name,
                    WidgetNamespace = m.Widget==null?"Services":m.Widget.InstanceName,
                    WidgetId = m.WidgetId,
                    WidgetServiceUrl = m.Widget != null ? m.Widget.ServiceUrl:null,
                    DefaultWebsiteId = m.DefaultWebsiteId,
                    Model = m.Model,
                    ViewModelType = m.ViewModelType,
                    Action = m.Action,
                }.GetAudit<ViewDto>(m);
            }
        }

        public static Expression<Func<Dashboard, DashboardDto>> DashboardListDto {
            get {
                return (m) => new DashboardDto()
                {
                    Id = m.Id,
                    Name = m.Name,
                    Layout = m.Layout,
                    ViewModelName = m.ViewModelName,
                    WebsiteId = m.WebsiteId,
                    IsDefault = m.IsDefault,
                    IsPublish = m.IsPublish,
                }.GetAudit<DashboardDto>(m);
            }
        }

        public static Expression<Func<Dashboard, DashboardDto>> DashboardDto
        {
            get
            {
                return (m) => new DashboardDto()
                {
                    Id = m.Id,
                    Name = m.Name,
                    Layout = m.Layout,
                    ViewModelName = m.ViewModelName,
                    WebsiteId = m.WebsiteId,
                    IsDefault = m.IsDefault,
                    IsPublish = m.IsPublish,
                    ViewIds = m.DashboardViews.Select(o => o.ViewId).ToList(),
                    RoleIds = m.DashboardSharings.Select(o => o.RoleId).ToList(),
                    UserIds = m.DashboardSharedUsers.Select(o=>o.UserId).ToList()
                }.GetAudit<DashboardDto>(m);
            }
        }
    }
}
