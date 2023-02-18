using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Platform.Data.DTOs;

namespace Yokogawa.LMS.Platform.Core.DTOs
{
    public class WebsiteDto :  AuditableDto, IWebsiteDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string HomePageId { get; set; }
        public Nullable<Guid> AdminRoleId { get; set; }
        public string HomePage { get; set; }
        public string Route { get; set; }
        public IEnumerable<RoleDto> Roles {get;set;}
        public IEnumerable<PageDto> Pages { get; set; }
        public string AuditTrailAPI { get; set; }
        public string DefaultLanguageId { get; set; }
        public bool IsSystemDefined { get; set; }
    }
}
