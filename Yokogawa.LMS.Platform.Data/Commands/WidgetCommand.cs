using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.LMS.Exceptions;
using Yokogawa.Data.Infrastructure.Extensions;
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.LMS.Platform.Data.Commands
{
    public static class WidgetCommand
    {
        public static async Task<ResourceFile> ValidatePermissionAsync(this DbSet<ResourceFile> dbSet, string fileUrl, IUserProfile user)
        {
            ResourceFile entity = await dbSet.Include(o => o.Website).Where(o=>o.FileUrl== fileUrl).FirstOrDefaultAsync();
            if (entity == null)
                return entity;

            bool isValid = entity.Website.AdminRoleId.HasValue && user.RoleIds.Contains(entity.Website.AdminRoleId.Value.ToString()) || user.RoleIds.Contains(PredefinedValues.AdminRoleId.ToString());
            if (!isValid)
                throw new UnauthorizedAccessException("action is not allowed");

            return entity;
        }
        public static async Task<Widget> ValidatePermissionAsync(this DbSet<Widget> dbSet, Guid id, IUserProfile user)
        {
            Widget entity = await dbSet.GetById(id).Include(o => o.Website).Include(o=>o.ResourceFiles).FirstOrDefaultAsync();
  
            if (entity == null) 
                return entity;

            bool isValid = entity !=null && (user.RoleIds.Contains(PredefinedValues.AdminRoleId.ToString()) || (entity.Website.AdminRoleId.HasValue && user.RoleIds.Contains(entity.Website.AdminRoleId.Value.ToString())));
            if (!isValid)
                throw new UnauthorizedAccessException("action is not allowed");
            return entity;
        }

        public static async Task ValidateDeleteAsync(this DbSet<Widget> dbSet,Guid id) {
            StringBuilder sb = new StringBuilder();
            bool isValid = true;
            
            if (id != Guid.Empty)
                isValid = await dbSet.AsNoTracking().Where(o =>o.WidgetTemplateId == id).CountAsync() == 0;

            if (isValid)
                sb.AppendLine("cannot delete widget template");

            var widget = await dbSet.Include(o=>o.Pages).Include(o=>o.Views).GetById(id).AsNoTracking().FirstOrDefaultAsync();
            
            isValid = widget==null || (widget != null && widget.Pages.Count() == 0 && widget.Views.Count()==0);
            if (isValid)
                sb.AppendLine("The pages of widget are registered in system, please delete relevant pages and/or views first");

            if (sb.Length > 0)
                throw new ConflictException(sb.ToString());
        }
        public static async Task ValidateAsync(this DbSet<Widget> dbSet, IWidgetDto dto)
        {
            StringBuilder sb = new StringBuilder();

            var isDuplicated = await dbSet.AsNoTracking()
                .Where(o => o.Id != dto.Id && !o.WidgetTemplateId.HasValue && !dto.TemplateId.HasValue && 
                (o.Name == dto.Name
                 || (!string.IsNullOrEmpty(o.SourceFilePath)&&o.SourceFilePath.ToLower()==dto.SourceFilePath.ToLower())
                )).CountAsync() > 0;
            
            var isDuplicatedModule = await dbSet.AsNoTracking()
                .Where(o => o.Id != dto.Id && o.Name == dto.Name&&o.DefaultWebsiteId == dto.DefaultWebsiteId).CountAsync() > 0;

            if (isDuplicated|| isDuplicatedModule)
                sb.AppendLine("Duplicate Widget or widget source files");
            
            var isTemplate = await dbSet.AsNoTracking().Where(o => dto.Id != Guid.Empty && o.WidgetTemplateId == dto.Id).CountAsync() > 0;
            if (isTemplate && dto.TemplateId.HasValue)
                sb.AppendLine("Template widget cannot refer to other template");

            if (sb.Length > 0)
                throw new ConflictException(sb.ToString());

        }

        public static async Task<Widget> CreateOrUpdateAsync(this DbSet<Widget> dbSet, IWidgetDto dto,IUserProfile user) {
            dto.SetAudit(user);
            var widget = await dbSet.ValidatePermissionAsync(dto.Id, user);
            
            bool isCreate = widget == null;
            bool isAdmin = user.RoleIds.Contains(PredefinedValues.AdminRoleId.ToString());
            
            if (dto.DefaultWebsiteId == PredefinedValues.AllWebsiteId && !isAdmin)
                throw new UnauthorizedAccessException("Unauthorized Action");

            await dbSet.ValidateAsync(dto);

            if (isCreate)
            {
                widget = new Widget();
                widget.DefaultWebsiteId = dto.DefaultWebsiteId;
                dbSet.Add(widget);
            }

            if (isAdmin) {
                widget.DefaultWebsiteId = dto.DefaultWebsiteId;
            }
            if (dto.TemplateId.HasValue) {
                var template = await dbSet.GetById(dto.TemplateId.Value).AsNoTracking().FirstOrDefaultAsync();
                dto.Name = template.Name;
                dto.InstanceName = template.InstanceName;
                dto.SourceFilePath = template.SourceFilePath;
                dto.TemplateFileFolder = template.TemplateFileFolder;
            }
            
            widget.Name = dto.Name;
            widget.InstanceName = dto.InstanceName;
            widget.Description = dto.Description;
            widget.SourceFilePath = dto.SourceFilePath;
            widget.ServiceUrl = dto.ServiceUrl;
            widget.TemplateFileFolder = dto.TemplateFileFolder;
            widget.WidgetTemplateId = dto.TemplateId;
            widget.SetAudit(dto,isCreate,true);

            //update widgets refer to the template
            if (!isCreate && !widget.WidgetTemplateId.HasValue) {
                var referencedWidgets = await dbSet.Where(o => o.WidgetTemplateId == widget.Id).ToListAsync();
                foreach (var item in referencedWidgets) {
                    item.Name = widget.Name;
                    item.InstanceName = widget.InstanceName;
                    item.SourceFilePath = widget.SourceFilePath;
                    item.TemplateFileFolder = widget.TemplateFileFolder;
                    item.SetAudit(user.UserId, user.UserName, isCreate, true);
                }
            }
            
            return widget;
        }

        public static void CreateOrUpdateResourceFiles(this Widget widget,IEnumerable<IResourceFileDto> resources) 
        {
            widget.ResourceFiles.Clear();
            foreach (var item in resources)
            {
                var file = new ResourceFile();
                widget.ResourceFiles.Add(file);
                file.FileName = item.FileName;
                file.FilePath = string.IsNullOrEmpty(item.FilePath) ? string.Empty : item.FilePath;
                file.FileUrl = string.IsNullOrEmpty(item.FileUrl) ? string.Empty : item.FileUrl;
                file.WebsiteId = widget.DefaultWebsiteId;
                file.SetAudit(item,true,true);
            }
        }

        public static async Task<IEnumerable<ResourceFile>> CreateOrUpdateAsync(this DbSet<ResourceFile> dbSet, IEnumerable<IResourceFileDto> dtos, IUserProfile user)
        {
            List<ResourceFile> result = new List<ResourceFile>();
            foreach (var dto in dtos) {
                dto.SetAudit(user.UserId, user.UserName);
                var file = await dbSet.ValidatePermissionAsync(dto.FileUrl, user);
                bool isCreate = file == null;
                if (isCreate)
                {
                    file = new ResourceFile();
                    dbSet.Add(file);
                    file.WidgetId = dto.WidgetId;
                }
                file.FileName = dto.FileName;
                file.FilePath = string.IsNullOrEmpty(dto.FilePath) ? string.Empty : dto.FilePath;
                file.FileUrl = string.IsNullOrEmpty(dto.FileUrl) ? string.Empty : dto.FileUrl;
                file.WebsiteId = dto.DefaultWebsiteId;
                file.SetAudit(dto, isCreate, true);
                result.Add(file);
            }
            return result;
        }
    }
}
