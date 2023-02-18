using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;


namespace Yokogawa.LMS.Platform.Core.DTOs
{
    public class WidgetSettingDto:AuditableDto, IWidgetSettingDto
    {
        public Guid Id { get; set; }
        public Guid RoleId { get; set; }
        public Guid WidgetId { get; set; }
        public Guid WebsiteId { get; set; }
        public string JSONParameter { get; set; }
        public string WidgetName { get; set; }
        public string PermissionFileUrl
        {
            get
            {
                return "/" + ResourceFilePath.JSONFileFolder.Replace("\\", "/") + "/" + WidgetName + ".json";
            }
        }
    }
}
