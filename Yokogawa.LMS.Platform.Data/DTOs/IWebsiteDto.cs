using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.LMS.Platform.Data.DTOs
{
    public interface IWebsiteDto : IAuditableDto, IDto<Guid>
    {
        string Name { get; set; }
        string HomePageId { get; set; }
        string DefaultLanguageId { get; set; }
        string Route { get; set; }
        Nullable<Guid> AdminRoleId { get; set; }
        string AuditTrailAPI { get; set; }
    }
}
