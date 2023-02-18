using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.LMS.Platform.Data.DTOs
{
    public interface IMenuDto: IDto<Guid>, IAuditableDto
    {
        string Name { get; set; }
        string Icon { get; set; }
        string PageId { get; set; }
        Nullable<Guid> ParentId { get; set; }
        int OrderId { get; set; }
        Guid WebsiteId { get; set; }
        List<Guid> RoleIds { get; set; }
    }
}
