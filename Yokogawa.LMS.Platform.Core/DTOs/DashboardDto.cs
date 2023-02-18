using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.LMS.Platform.Core.DTOs
{
    public class DashboardDto: AuditableDto, IDashboardDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string ViewModelName { get; set; }
        public int Layout { get; set; }
        public bool IsPublish { get; set; }
        public Guid WebsiteId { get; set; }
        public bool IsDefault { get; set; }
        public List<Guid> ViewIds { get; set; } = new List<Guid>();
        public List<ViewDto> ViewSource { get; set; }
        public List<UserDto> Users { get; set; }

        public List<Guid> RoleIds { get; set; } = new List<Guid>();
        public List<string> UserIds { get; set; } = new List<string>();
    }
}
