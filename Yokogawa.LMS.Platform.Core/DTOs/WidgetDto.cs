using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.Data.Infrastructure.Entities;

namespace Yokogawa.LMS.Platform.Core.DTOs
{
    public class WidgetDto:AuditableDto,IWidgetDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string InstanceName { get; set; }
        public string Description { get; set; }
        public string SourceFilePath { get; set; }
        public string ServiceUrl { get; set; }
        public string TemplateFileFolder { get; set; }
        public string WebsiteName { get; set; }
        public string TemplateWebsiteName { get; set; }
        public Guid DefaultWebsiteId { get; set; }
        public Guid WebsiteId { get; set; }
        public Guid? TemplateId { get; set; }
        public bool GlobalScope {
            get {
                return DefaultWebsiteId == PredefinedValues.AllWebsiteId;
            }
            set {
                if (value)
                    DefaultWebsiteId = PredefinedValues.AllWebsiteId;
            }
        }
        public bool IsTemplate { get; set; }
        public bool UseTemplate
        {
            get
            {
                return TemplateId.HasValue;
            }
        }
        public bool EnableGlobalWidget { get; set; }
        public string SourceFileName
        {
            get
            {
                if (string.IsNullOrEmpty(SourceFilePath))
                    return string.Empty;
                return SourceFilePath.Substring(SourceFilePath.LastIndexOf('/') + 1);
            }
        }
        public string TemplateFileName
        {
            get
            {
                if (string.IsNullOrEmpty(TemplateFileFolder))
                    return string.Empty;
                return TemplateFileFolder.Substring(TemplateFileFolder.LastIndexOf('/') + 1);
            }
        }
 
        public List<WidgetRoleSetting> RoleSettings;
        public List<ResourceFileDto> Resources { get; set; } = new List<ResourceFileDto>();

        public void SetAudit(IUserProfile user) {
            this.SetAudit(user.UserId,user.UserName);
            foreach (var resource in Resources) {
                resource.DefaultWebsiteId = this.WebsiteId;
                resource.SetAudit(user.UserId, user.UserName);
            }
            
        }

    }

    public class WidgetRoleSetting
    {
        public int RoleId { get; set; }
        public string JSONParameter { get; set; }
    }
}
