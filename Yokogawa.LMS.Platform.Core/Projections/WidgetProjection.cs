using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Linq.Expressions;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.Data.Infrastructure.Utils;
using Yokogawa.Data.Infrastructure.Extensions;

namespace Yokogawa.LMS.Platform.Core.Projections
{
    public static class WidgetProjection
    {
        public static Expression<Func<Widget, WidgetDto>> WidgetListDto {
            get {
                return (m) => new WidgetDto()
                {
                    Id = m.Id,
                    Name = m.Name,
                    InstanceName = m.InstanceName,
                    Description = m.Description,
                    ServiceUrl = m.ServiceUrl,
                    SourceFilePath = m.SourceFilePath,
                    TemplateFileFolder = m.TemplateFileFolder,
                }.GetAudit<WidgetDto>(m);
            }

        }

        public static Expression<Func<Widget, WidgetDto>> WidgetDto
        {
            get
            {
                return (m) => new WidgetDto()
                {
                    Id = m.Id,
                    Name = m.Name,
                    InstanceName = m.InstanceName,
                    Description = m.Description,
                    ServiceUrl = m.ServiceUrl,
                    SourceFilePath = m.SourceFilePath,
                    TemplateFileFolder = m.TemplateFileFolder,
                    Resources = ConvertToResourceFileDtos(m.ResourceFiles),
                    DefaultWebsiteId = m.DefaultWebsiteId,
                    TemplateId = m.WidgetTemplateId,
                    WebsiteId = m.DefaultWebsiteId,
                    WebsiteName = m.Website!=null?m.Website.Name:string.Empty
                }.GetAudit<WidgetDto>(m);
            }

        }

        public static List<ResourceFileDto> ConvertToResourceFileDtos(ICollection<ResourceFile> files) {
            files = files ?? new List<ResourceFile>();
            var result =files.Select<ResourceFile, ResourceFileDto>(p => new ResourceFileDto()
            {
                Id = p.Id,
                FileName = p.FileName,
                FilePath = p.FilePath,
                FileUrl = p.FileUrl
            }.GetAudit<ResourceFileDto>(p)).ToList();
            return result;
        }
    }
}
