using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Platform.Data.DTOs;

namespace Yokogawa.LMS.Platform.Core.DTOs
{
    public class MenuDto : AuditableDto, IMenuDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Icon { get; set; }
        public string PageId { get; set; }
        public Nullable<Guid> ParentId { get; set; }
        public int OrderId { get; set; }
        public Guid WebsiteId { get; set; }
        public Guid? WidgetId { get; set; }
        public string PageDescription { get; set; }
        public string ParentName { get; set; }
        public List<Guid> RoleIds { get; set; }
        public bool IsChecked { get; set; }
        public bool IsUserLevel { get; set; }
        public List<PageDto> Pages { get; set; } = new List<PageDto>();
    }
}
