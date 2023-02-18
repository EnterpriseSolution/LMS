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
using Yokogawa.Data.Infrastructure.Utils;

namespace Yokogawa.LMS.Business.Data.Commands
{
    public static class RFIDCardCommands
    {
        public static async Task<RFIDCard> ValidatePermissionAsync(this DbSet<RFIDCard> dbSet, Guid id)
        {
            RFIDCard entity = await dbSet.GetById(id).FirstOrDefaultAsync();

            return entity;
        }

        public static async Task ValidateAsync(this DbSet<RFIDCard> dbSet, IRFIDCardDto dto)
        {
            StringBuilder sb = new StringBuilder();

            bool isDuplicated = await dbSet.ExcludeDeletion().AsNoTracking().Where(o => o.Id != dto.Id && dto.Id != Guid.Empty).CountAsync() > 0;
            if (isDuplicated)
                sb.AppendLine("Duplicate Record");

            if (sb.Length > 0)
                throw new ConflictException(sb.ToString());
        }

        public static async Task<RFIDCard> CreateOrUpdateAsync(this DbSet<RFIDCard> dbSet, IRFIDCardDto dto, IUserProfile profile)
        {
            dto.SetAudit(profile.UserId, profile.UserName);
            var card = await dbSet.ValidatePermissionAsync(dto.Id);
            bool isCreate = card == null;

            if (isCreate)
            {
                card = new RFIDCard();
                card.Id = Guid.NewGuid();
                dbSet.Add(card);
            }
            //await dbSet.ValidateAsync(dto);

            card.CardNo = dto.CardNo;
            card.CardType = dto.CardType;
            if (!string.IsNullOrWhiteSpace(dto.ValidDate))
                card.ValidDate = MappingUtil.ConvertStringToDateTime(dto.ValidDate);
            card.Status = dto.Status;
            card.Remarks = dto.Remarks;
            card.SetAudit(dto, isCreate, true);

            return card;
        }

        public static async Task<RFIDCard> DeleteAsync(this DbSet<RFIDCard> dbSet, Guid id, IUserProfile profile)
        {
            var card = await dbSet.ValidatePermissionAsync(id);
            bool isDeleted = card != null;
            if (isDeleted)
                card.LogicDelete(profile.UserId, profile.UserName, true);

            return card;
        }
    }
}
