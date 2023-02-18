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
    public static class CustomerCommands
    {
        public static async Task<Customer> ValidatePermissionAsync(this DbSet<Customer> dbSet, Guid id)
        {
            Customer entity = await dbSet.GetById(id).FirstOrDefaultAsync();

            return entity;
        }

        public static async Task ValidateAsync(this DbSet<Customer> dbSet, ICustomerDto dto)
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

        public static async Task<Customer> CreateOrUpdateAsync(this DbSet<Customer> dbSet, ICustomerDto dto, IUserProfile profile)
        {
            dto.SetAudit(profile.UserId, profile.UserName);
            var customer = await dbSet.ValidatePermissionAsync(dto.Id);
            bool isCreate = customer == null;

            if (isCreate)
            {
                customer = new Customer();
                customer.Id = Guid.NewGuid();
                dbSet.Add(customer);
            }
            await dbSet.ValidateAsync(dto);

            customer.CustomerCode = dto.CustomerCode;
            customer.CustomerAlias = dto.CustomerAlias;
            customer.CustomerCRNo = dto.CustomerCRNo;
            customer.Address = dto.Address;
            customer.Country = dto.Country;
            customer.PersonInCharge = dto.PersonInCharge;
            customer.Mobile = dto.Mobile;
            customer.PhoneO = dto.PhoneO;
            customer.PhoneR = dto.PhoneR;
            customer.Fax = dto.Fax;
            customer.BillingAddress = dto.BillingAddress;
            customer.BillingCountry = dto.BillingCountry;
            customer.BillTelephone = dto.BillTelephone;
            customer.Status = dto.Status;
            customer.Remarks = dto.Remarks;
            customer.SetAudit(dto, isCreate, true);

            return customer;
        }

        public static async Task<Customer> DeleteAsync(this DbSet<Customer> dbSet, Guid id, IUserProfile profile)
        {
            var customer = await dbSet.ValidatePermissionAsync(id);
            bool isDeleted = customer != null;
            if (isDeleted)
                customer.LogicDelete(profile.UserId, profile.UserName, true);

            return customer;
        }
    }
}
