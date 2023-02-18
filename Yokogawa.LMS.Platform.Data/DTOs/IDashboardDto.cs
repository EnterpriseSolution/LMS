using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.LMS.Platform.Data.DTOs
{
    public interface IDashboardDto : IDto<Guid>, IAuditableDto
    {
        public string Name { get; set; }
        public string ViewModelName { get; set; }
        public int Layout { get; set; }
        public bool IsPublish { get; set; }
        public Guid WebsiteId { get; set; }
        public bool IsDefault { get; set; }
        public List<Guid> RoleIds { get; set; }
        public List<Guid> ViewIds { get; set; }
        public List<string> UserIds { get; set; }
    }
}
