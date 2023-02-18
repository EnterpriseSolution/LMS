using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities.Base;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.Data.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.Data.Infrastructure.Extensions
{
    public static class EntityExtension
    {
        public static T GetAudit<T>(this T dto, IAuditable entity) where T:IAuditableDto {
            dto.LastModifiedOn = entity.UpdatedOn.HasValue ? entity.UpdatedOn.Value : entity.CreatedOn;
            dto.LastModifiedBy = entity.UpdatedOn.HasValue ? entity.UpdatedBy : entity.CreatedBy;
            dto.LastModifiedByName = entity.UpdatedOn.HasValue ? entity.UpdatedBy : entity.CreatedBy;
            dto.CreatedBy = entity.CreatedBy; 
            dto.CreatedByName = entity.CreatedBy;
            dto.CreatedOn = entity.CreatedOn;

            return dto;
        }

        public static T GetAudit<T>(this T dto, IAuditableExtension entity) where T:IAuditableDto
        {
            dto.LastModifiedOn = entity.UpdatedOn.HasValue ? entity.UpdatedOn.Value : entity.CreatedOn;
            dto.LastModifiedBy = entity.UpdatedOn.HasValue ? entity.UpdatedBy : entity.CreatedBy;
            dto.LastModifiedByName = entity.UpdatedOn.HasValue ? entity.UpdatedByName : entity.CreatedByName;
            dto.CreatedBy = entity.CreatedBy; ;
            dto.CreatedByName = entity.CreatedBy;
            dto.CreatedOn = entity.CreatedOn;
            return dto;
        }

        public static void LogicDelete(this ISoftDeleteEntity entity, IAuditableDto dto,bool isUtc=false)
        {
            entity.IsDeleted = true;
            if (entity is IAuditableExtension)
                ((IAuditableExtension)entity).SetAudit(dto, false, isUtc);
            else if (entity is IAuditable)
                ((IAuditable)entity).SetAudit(dto, false, isUtc);
        }

        public static void LogicDelete(this ISoftDeleteEntity entity, string userId,string userName,bool isUtc=false)
        {
            entity.IsDeleted = true;
            if (entity is IAuditable)
                ((IAuditable)entity).SetAudit(userId,userName,false,isUtc);
        }

        public static void LogicDelete(this ISoftDeleteEntity entity)
        {
            entity.IsDeleted = true;
        }

        public static void AddWithNewId<T>(this DbSet<T> entityDbSet, T entity) where T : Entity<string>
        {
            entity.Id = Guid.NewGuid().ToString();
            entityDbSet.Add(entity);
        }

        public static void AddWithNewGuid<T>(this DbSet<T> entityDbSet, T entity) where T : Entity<Guid>
        {
            entity.Id = Guid.NewGuid();
            entityDbSet.Add(entity);
        }

    }
}
