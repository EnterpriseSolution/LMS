using System;
using System.Text;
using System.Linq;
using Yokogawa.Data.Infrastructure.Extensions;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Yokogawa.LMS.Business.Data.DTOs;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.LMS.Exceptions;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Business.Data.Entities;
using System.Collections.Generic;

namespace Yokogawa.LMS.Business.Data.Commands
{
    public static class ProductCommands
    {
        public static async Task<Product> ValidatePermissionAsync(this DbSet<Product> dbSet, Guid id)
        {
            Product entity = await dbSet.GetById(id).FirstOrDefaultAsync();

            return entity;
        }

        public static async Task ValidateAsync(this DbSet<Product> dbSet, IProductDto dto)
        {
            StringBuilder sb = new StringBuilder();

            List<Guid> RestIdList = await dbSet.ExcludeDeletion().AsNoTracking().Where(o => o.Id != dto.Id && dto.Id != Guid.Empty).Select(p => p.Id).ToListAsync();
            if (dto.Id != Guid.Empty && RestIdList.Contains(dto.Id))
            {
                sb.AppendLine("Duplicate Record");
            }

            if (sb.Length > 0)
                throw new ConflictException(sb.ToString());
        }

        public static async Task<Product> CreateOrUpdateAsync(this DbSet<Product> dbSet, IProductDto dto, IUserProfile profile)
        {
            dto.SetAudit(profile.UserId, profile.UserName);
            var product = await dbSet.ValidatePermissionAsync(dto.Id);
            bool isCreate = product == null;

            if (isCreate)
            {
                product = new Product();
                product.Id = Guid.NewGuid();
                dbSet.Add(product);
            }
            await dbSet.ValidateAsync(dto);

            product.ProductName = dto.ProductName;
            product.HSCode = dto.HSCode;
            product.ProductGroup = dto.ProductGroup;
            product.AvgVCF = dto.AvgVCF;
            product.AvgRefDensity = dto.AvgRefDensity;
            product.Status = dto.Status;
            product.Remarks = dto.Remarks;
            product.SetAudit(dto, isCreate, true);

            return product;
        }

        public static async Task<Product> DeleteAsync(this DbSet<Product> dbSet, Guid id, IUserProfile profile)
        {
            var product = await dbSet.ValidatePermissionAsync(id);
            bool isDeleted = product != null;
            if (isDeleted)
                product.LogicDelete(profile.UserId, profile.UserName, true);

            return product;
        }
    }
}
