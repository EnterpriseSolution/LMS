using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Yokogawa.Data.Infrastructure.Extensions;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.LMS.Exceptions;
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.LMS.Platform.Data.Commands
{
    public static class UserCommands
    {
        public static string Base64Encode(string plainText)
        {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return System.Convert.ToBase64String(plainTextBytes);
        }

        public static string Base64Decode(string encodedString)
        {
            byte[] data = Convert.FromBase64String(encodedString);
            return Encoding.UTF8.GetString(data);
        }

        public static async Task<User> ValidatePermissionAsync(this DbSet<User> dbSet, Guid id, IUserProfile user)
        {
            User entity = await dbSet.GetById(id).Include(o => o.Website).FirstOrDefaultAsync();
            
            if (entity == null)
                return entity;

            bool isValid = entity.Website.AdminRoleId.HasValue && user.RoleIds.Contains(entity.Website.AdminRoleId.Value.ToString()) || user.RoleIds.Contains(PredefinedValues.AdminRoleId.ToString());// || (entity.CreatedBy == user.UserId );
            if (!isValid)
                throw new UnauthorizedAccessException("action is not allowed");
            return entity;
        }

        public static async Task<ADUser> ValidatePermissionAsync(this DbSet<ADUser> dbSet, Guid id, IUserProfile user)
        {
            ADUser entity = await dbSet.GetById(id).Include(o => o.Website).FirstOrDefaultAsync();
            if (entity == null)
                return entity;

            bool isValid = entity.Website.AdminRoleId.HasValue && user.RoleIds.Contains(entity.Website.AdminRoleId.Value.ToString()) || user.RoleIds.Contains(PredefinedValues.AdminRoleId.ToString());// || (entity.CreatedBy == user.UserId );
            if (!isValid)
                throw new UnauthorizedAccessException("action is not allowed for user "+entity.UserId);
            return entity;
        }

        public static void ValidateDeletion(this User user)
        {
            StringBuilder sb = new StringBuilder();
           
            bool isForbidden = user != null && user.IsSystemDefined;

            if (isForbidden)
                sb.AppendLine("Fobidden Delete");

            if (sb.Length > 0)
                throw new ConflictException(sb.ToString());
        }

        public static async Task ValidateAsync(this DbSet<User> dbSet, IUserDto dto) {
            StringBuilder sb = new StringBuilder();

            bool isDuplicated = await dbSet.ExcludeDeletion().AsNoTracking().Where(o => o.UserId == dto.UserId && o.Id != dto.Id && dto.Id != Guid.Empty).CountAsync() > 0;
            if (isDuplicated)
                sb.AppendLine("Duplicate Record");

            if (sb.Length > 0)
                throw new ConflictException(sb.ToString());
        }

        public static async Task ValidateAync(this DbSet<ADUser> dbSet, IUserDto dto)
        {
            StringBuilder sb = new StringBuilder();
            var user = await dbSet.ExcludeDeletion().AsNoTracking().Where(o => o.UserId == dto.UserId && o.Id != dto.Id && dto.Id != Guid.Empty).FirstOrDefaultAsync();
            if (user != null)
                sb.AppendLine("Duplicate Record");

            if (sb.Length > 0)
                throw new ConflictException(sb.ToString());
        }

        public static async Task<User> DeleteAsync(this DbSet<User> dbSet, Guid id, IUserProfile profile) {
            var user =await dbSet.ValidatePermissionAsync(id, profile);
            bool isDeleted = user != null;
            if (isDeleted) {
                user.ValidateDeletion();
                user.LogicDelete(profile.UserId, profile.UserName, true);
            }
            return user;
        }

        public static async Task<ADUser> DeleteAsync(this DbSet<ADUser> dbSet, Guid id, IUserProfile profile)
        {
            var user = await dbSet.ValidatePermissionAsync(id, profile);
            bool isDeleted = user != null;
            if (isDeleted)
                user.LogicDelete(profile.UserId, profile.UserName, true);

            return user;
        }

        public static async Task<User> CreateOrUpdateAsync(this DbSet<User> dbSet,IUserDto dto, IUserProfile profile)
        {
            dto.SetAudit(profile.UserId, profile.UserName);
            var user = await dbSet.ValidatePermissionAsync(dto.Id, profile);
            bool isCreate = user == null;
            var isAdmin = profile.RoleIds.Contains(PredefinedValues.AdminRoleId.ToString());
            
            if (isCreate)
            {
                user = new User();
                user.UserId = dto.UserId;
                user.DefaultWebsiteId = dto.DefaultWebsiteId;
                dbSet.Add(user);
            }

            await dbSet.ValidateAsync(dto);

            if (!user.IsSystemDefined && isAdmin)
                 user.DefaultWebsiteId = dto.DefaultWebsiteId;

            user.DisplayName = dto.DisplayName;
            user.Email = dto.Email;
            user.Company = dto.Company;
            user.Password = dto.Password;
            user.SetAudit(dto, isCreate, true);

            return user;
        }

        public static async Task<ADUser> CreateOrUpdateAsync(this DbSet<ADUser> dbSet, IUserDto dto, IUserProfile profile)
        {
            dto.SetAudit(profile.UserId, profile.UserName);
            var user = await dbSet.ValidatePermissionAsync(dto.Id, profile);
            bool isCreate = user == null;
            var isAdmin = profile.RoleIds.Contains(PredefinedValues.AdminRoleId.ToString());

            if (isCreate)
            {
                user = new ADUser();
                user.UserId = dto.UserId;
                user.DefaultWebsiteId = dto.DefaultWebsiteId;
                dbSet.Add(user);
            }

            if (isAdmin)
                user.DefaultWebsiteId = dto.DefaultWebsiteId;

            user.DisplayName = dto.DisplayName;
            user.Email = dto.Email;
            user.Company = dto.Company;
            user.SetAudit(dto, isCreate, true);

            return user;
        }

        public static async Task<ADUser> UpdateAsync(this DbSet<ADUser> dbSet, IUserDto dto)
        {
            dto.SetAudit(dto.UserId, dto.DisplayName);
            var user = await dbSet.Where(o => o.UserId == dto.UserId).FirstOrDefaultAsync();
            if (user == null)
                return user;
            
            user.DisplayName = dto.DisplayName;
            user.Email = !string.IsNullOrEmpty(dto.Email)?dto.Email:user.Email;
            user.Company =!string.IsNullOrEmpty(dto.Company)? dto.Company:user.Company;
            user.SetAudit(dto, false, true);

            return user;
        }
        public static async Task<Contact> CreateOrUpdateAsync(this DbSet<Contact> dbSet, Contact contact) {
            var item = await dbSet.GetById(contact.Id).FirstOrDefaultAsync();
            bool isCreated = item == null;
            if (isCreated) {
                item = contact;
                dbSet.Add(item);
            }
            else {
                item.ContactName = contact.ContactName;
                item.ContactEmail = contact.ContactEmail;
                item.ContactId = contact.ContactId;
                item.Extension = contact.Extension;
                item.Mobile = contact.Mobile;
                item.Company = contact.Company;
            }
            
            return item;
        }

        public static async Task CreateOrUpdateAsync(this DbSet<ADUser> dbSet, IEnumerable<IUserDto> users,IUserProfile profile)
        {
            foreach (var userDto in users) {
                await dbSet.CreateOrUpdateAsync(userDto,profile);
            }
            
        }
    }
}
