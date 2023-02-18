using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.LMS.Platform.Data.DTOs
{
    public interface IWidgetDto: IDto<Guid>,IAuditableDto
    {
        string Name { get; set; }
        string InstanceName { get; set; }
        string Description { get; set; }
        string SourceFilePath { get; set; }
        string ServiceUrl { get; set; }
        string TemplateFileFolder { get; set; }
        Guid? TemplateId { get; set; }
        Guid DefaultWebsiteId { get; set; }
        public Guid WebsiteId { get; set; }
        void SetAudit(IUserProfile user);
    }
}
