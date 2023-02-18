using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.LMS.Platform.Data.DTOs
{
    public interface IRoleDto :  IAuditableDto
    {
        Guid Id { get; set; }
        string Name { get; set; }
        string Description { get; set; }
        string DefaultPageId { get; set; }
        Guid WebsiteId { get; set; }
        Guid DefaultWebsiteId { get; set; }
        List<int> SFAProviderIds { get; set; }
        List<Guid> PermissionIds { get; set; }
        void SetAudit(IUserProfile user);

    }
}
