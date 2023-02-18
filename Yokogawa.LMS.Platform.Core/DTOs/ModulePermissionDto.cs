using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.LMS.Platform.Core.DTOs
{
    public class ModulePermissionDto : IModulePermissionDto
    {
        public string Name { get; set; }
        public string Description{ get; set; }
        public string WidgetName { get; set; }
        public int ResourceTypeId { get; set; }
        public string ResourceType {
            get {
                if (ResourceTypeId <0 || ResourceTypeId>2)
                    return string.Empty;
                else {
                    EnumResourceType type = (EnumResourceType)ResourceTypeId;
                    return type.ToString();
                }
            }
        }
        public Guid RoleId { get; set; }
        public Guid? WidgetId { get; set; }
        public Guid WebsiteId { get; set; }
        public bool ReadPermission { get; set; }
        public bool WritePermission { get; set; }
        public Guid Id { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedByName { get; set; }
        public DateTime CreatedOn { get; set; }
        public string LastModifiedBy { get; set; }
        public DateTime LastModifiedOn { get; set; }
        public string LastModifiedByName { get; set; }
    }
}
