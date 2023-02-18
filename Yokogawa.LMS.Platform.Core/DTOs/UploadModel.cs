using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Yokogawa.LMS.Platform.Core.DTOs
{
    public class UploadModel
    {
        [Required]
        public string FileName { get; set; }
        [Required]
        public Guid? WidgetId { get; set; }
        [Required]
        public Guid DefaultWebsiteId { get; set; }
        [DataType(DataType.Upload)]
        public List<IFormFile> Files { get; set; }

    }

    public static class ResourceFilePath {
        public const string ScriptFileFolder = @"src\components";
        public const string JSONFileFolder = @"src\components\resources";
        public const string TemplateFileFolder = @"src\view";
        public const string WidgetAttachmentFileFolder = @"src\components\attachment";
        public const string AttachmentFileFolder = "attachment";
       // public const string ScriptFolderUrl = "app/components/";
        //public const string TemplateFolderUrl = "src/view/";
        //public const string AttachmentFolderUrl = "~/attachment/";
    }
}
