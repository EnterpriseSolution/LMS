using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Platform.Data.DTOs;

namespace Yokogawa.LMS.Platform.Core.DTOs
{
    public class ViewDto: AuditableDto,IViewDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public string Description { get; set; }

        public string Widget { get; set; } = "";
        public string WidgetNamespace { get; set; } = "";

        public string WidgetServiceUrl { get; set; }
        public Guid? WidgetId { get; set; }

        public Guid DefaultWebsiteId { get; set; } 

        public string Model { get; set; }

        public string ViewModelType { get; set; }

        public string Action { get; set; }
        public bool IsPrivate { get; set; }

        string m_actionName = string.Empty;
        public string ActionName
        {
            get
            {
                if (string.IsNullOrEmpty(Action))
                    return string.Empty;
                return Action.Substring(Action.LastIndexOf('.') + 1);
            }
            set
            {
                m_actionName = value;
            }
        }

        public List<WidgetDto> WidgetSource { get; set; } = new List<WidgetDto>();
    }
}
