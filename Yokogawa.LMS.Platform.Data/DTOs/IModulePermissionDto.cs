using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.LMS.Platform.Data;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.LMS.Platform.Data.DTOs
{
    public interface IModulePermissionDto: IDto<Guid>, IAuditableDto
    {
        string Name { get; set; }
        string Description { get; set; }
        int ResourceTypeId { get; set; }
        Guid RoleId { get; set; }
        Guid? WidgetId { get; set; }
        Guid WebsiteId { get; set; }
        bool ReadPermission { get; set; }
        bool WritePermission { get; set; }
    }
}
