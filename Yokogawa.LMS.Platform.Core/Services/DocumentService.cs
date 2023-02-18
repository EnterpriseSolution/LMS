using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.LMS.Platform.Core.Services.Interfaces;
using System.Linq;
using Yokogawa.Data.Infrastructure.QueryObjects;
using System.Threading.Tasks;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.LMS.Platform.Data;
using Yokogawa.LMS.Platform.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Platform.Data.Commands;
using Yokogawa.LMS.Exceptions;
using Microsoft.AspNetCore.Http;
using System.IO;
using Yokogawa.Data.Infrastructure.Extensions;
using Yokogawa.Data.Infrastructure.Entities;

namespace Yokogawa.LMS.Platform.Core.Services
{
    public class DocumentService : BaseService<DocumentService>,IDocumentService
    {
        public DocumentService(JoypadDBContext dbContext, ILogger<DocumentService> logger) : base(dbContext, logger)
        {
        }

        public async Task<IEnumerable<ResourceFileDto>> SaveResourcefiles(UploadModel uploadModel, IUserProfile user)
        {
            var files = new List<ResourceFileDto>();
            if (uploadModel.Files.Count == 0)
                return files;

            var permissionLevel = await GetPermissionLevel(user, uploadModel.DefaultWebsiteId);
            if (permissionLevel == EnumPermissionLevel.User)
                throw new NotFoundCustomException("Action is not allowed");
            
            foreach (var item in uploadModel.Files)
            {
                IFormFile file = item;
                string folderPath = "";
                string fileUrl =string.Empty;
                switch (Path.GetExtension(file.FileName).ToLower())
                {
                    case ".js":
                        folderPath = ResourceFilePath.ScriptFileFolder;
                        break;
                    case ".json":
                        folderPath = ResourceFilePath.JSONFileFolder;
                        break;
                    case ".html":
                        folderPath = ResourceFilePath.TemplateFileFolder;
                        break;
                    default:
                        folderPath =uploadModel.WidgetId.HasValue? (ResourceFilePath.WidgetAttachmentFileFolder+@"\"+uploadModel.WidgetId): ResourceFilePath.AttachmentFileFolder;
                        break;
                }
                folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folderPath);
                var path = Path.Combine(folderPath,file.FileName);
                var backupPath = Path.Combine(folderPath,"backup");

                if (!File.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);
                // backup files
                if (File.Exists(path))
                {
                    Directory.CreateDirectory(backupPath);
                    var now = DateTime.Now.ToUniversalTime().ToString("yyyyMMddHHmmss");
                    var destFile = Path.Combine(backupPath, now+ file.FileName);
                    File.Copy(path, destFile);
                }

                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var newItem = new ResourceFileDto() { 
                    WidgetId = uploadModel.WidgetId, 
                    DefaultWebsiteId = uploadModel.DefaultWebsiteId, 
                    FileName = item.FileName,
                    FilePath = path,
                    FileUrl = fileUrl+item.FileName
                };
                files.Add(newItem);
            }

            var newFiles = await _dbContext.ResourceFiles.CreateOrUpdateAsync(files, user);
            await _dbContext.SaveChangesAsync();
            var i = 0;

            foreach (var item in newFiles)
            {
                files[i].Id = item.Id;
                files[i].FileUrl = item.FileUrl;
                files[i].GetAudit<ResourceFileDto>(item);
                i++;
            }
            
           
            return files;
        }

        public async Task DeleteResourcefile(Guid id, IUserProfile user)
        {
            var file = await _dbContext.ResourceFiles.GetById(id).FirstOrDefaultAsync();
            if (file == null)
                return;

            await _dbContext.ResourceFiles.ValidatePermissionAsync(file.FileUrl, user);

            _dbContext.ResourceFiles.Remove(file);
            await _dbContext.SaveChangesAsync();
            File.Delete(file.FilePath);
        }

        public async Task<ResourceFileDto> ReadResourceFileContent(Guid id, IUserProfile user)
        {

            var file = await _dbContext.ResourceFiles.GetById(id).FirstOrDefaultAsync();

            if (file == null || string.IsNullOrEmpty(file.FilePath))
                throw new ConflictException("filename not present");

            await _dbContext.ResourceFiles.ValidatePermissionAsync(file.FileUrl, user);

            ResourceFileDto doc = new ResourceFileDto() {
                Id = file.Id,
                DefaultWebsiteId = file.WebsiteId,
                FilePath = file.FilePath,
                FileName = file.FileName,
                FileUrl = file.FileUrl
            }.GetAudit<ResourceFileDto>(file);
            

            string filename = file.FilePath;
   
            var path = Path.Combine(Directory.GetCurrentDirectory(),"wwwroot", filename);

            using (var stream = new FileStream(path, FileMode.Open))
            {
                doc.Content = new byte[stream.Length];
                await stream.WriteAsync(doc.Content);
            }
            
            return doc;
        }
    }
}
