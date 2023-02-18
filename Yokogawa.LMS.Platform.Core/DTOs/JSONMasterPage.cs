using System;
using System.Collections.Generic;
using System.Text;

namespace Yokogawa.LMS.Platform.Core.DTOs
{
    public class JSONMenus
    {
        public string text { get; set; }
        public string icon { get; set; }
        public JSONPageInfo page { get; set; }
        public List<JSONMenus> menus { get; set; }
        public Guid id { get; set; }
    }

    public class JSONPageInfo
    {
        public string Id { get; set; }
        public string url { get; set; }
        public int type { get; set; }
    }

    public class JSONRoleSetting
    {
        public Guid RoleId { get; set; }
        public string JSONParameter { get; set; }
    }

    public class JSONWidget
    {
        public Guid Id { get; set; }
        public string ServiceUrl { get; set; }
        public string Name { get; set; }
        public string InstanceName { get; set; }
        public string TemplateFileFolder { get; set; }
        public string Component { get; set; }
        public List<string> RoleSettings { get; set; }
        public List<string> DisableResources { get; set; } = new List<string>();
    }


    public class JSONView
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Model { get; set; }
        public string Action { get; set; }
        public string ViewModelType { get; set; }
        public string ServiceUrl { get; set; }
        public string ViewName { get; set; }


    }

    public class JSONDashboard
    {
        public Guid Id { get; set; }
        public string ViewModelName { get; set; }
        public int Layout { get; set; }
        public List<JSONView> Views { get; set; }
    }


    public class JSONMasterPage
    {
        public JSONMasterPage() {
            menus = new List<JSONMenus>();
            components = new List<string>();
            widgets = new List<JSONWidget>();
            dashboards = new List<JSONDashboard>();
        }
        public Guid id { get; set; }
        public string name { get; set; }
        public bool IsAdmin { get; set; }
        public string AuditTrailAPI { get; set; }
        public string DefaultLanguageId { get; set; }
        public string route { get; set; }
        public JSONPageInfo homepage { get; set; }
        public List<JSONMenus> menus { get; set; }
        public List<string> components { get; set; }
        public List<JSONWidget> widgets { get; set; }
        public List<JSONDashboard> dashboards { get; set; }
    }
}
