using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.LMS.Platform.Data.DTOs;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.Data.Infrastructure.Extensions;
using System.Linq;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Exceptions;

namespace Yokogawa.LMS.Platform.Data.Commands
{
    public static class UserOTPCommand
    {
        public static async Task<bool> CreateSecretAsync(this DbSet<UserOTPSetting> dbSet, IUserProfile user) {
            var temp = user.SFASettings.Where(o => o.HasSecret == 0).ToList();
            foreach (var setting in temp)
                await dbSet.CreateSecretAsync(user.SFASettings, user);

            return temp.Count() > 0;
        }
        public static async Task<string> CreateSecretAsync(this JoypadDBContext dBContext, IUserProfile user) {
            string error = string.Empty;
            try
            {
                bool isCreate = await dBContext.UserOTPSettings.CreateSecretAsync(user);

                if (isCreate)
                    await dBContext.SaveChangesAsync();
            }
            catch (Exception ex) {
                error = "Fails to create secret:" + ex.Message;
            }
            return error;
        }

        public static async Task<UserOTPSetting> CreateOrUpdateSecretAsync(this DbSet<UserOTPSetting> dbSet, string userId,int providerId,IUserProfile user)
        {
            UserOTPSetting settings = await dbSet.Where(o => o.UserId == userId && o.ProviderId == providerId).FirstOrDefaultAsync();

            bool isCreate = settings == null;
            if (isCreate)
            {
                settings = new UserOTPSetting();
                settings.UserId = user.UserId;
                settings.ProviderId = providerId;
                dbSet.Add(settings);
            }

            settings.Secret = OTPAlgorithm.GenerateKey();
            settings.SetAudit(user.UserId, user.UserName, isCreate, true);
            return settings;
        }

        public static async Task<IEnumerable<IUserDto>> ValidateCreateSecretAsync(this DbSet<UserOTPSetting> dbSet, int providerId, IEnumerable<IUserDto> users) {
            var userIds = users.Select(o => o.UserId).ToList();
            var existingItems = await dbSet.Where(o => o.ProviderId == providerId && userIds.Contains(o.UserId)).Select(o=>o.UserId).ToListAsync();

            return users.Where(o => !existingItems.Contains(o.UserId));

        }
        public static async Task CreateSecretAsync(this DbSet<UserOTPSetting> dbSet, IEnumerable<IMFASettingDto> sfaSettings,IUserProfile userProfile) {
            if (sfaSettings.Count() == 0)
                return;

            var temp = sfaSettings.Select(o => o.UserId + "_" + o.ProviderId.ToString()).ToList();
            var existingList = await dbSet.Where(o => temp.Contains(o.UserId + "_" + o.ProviderId.ToString())).Select(o => o.UserId + "_" + o.ProviderId.ToString()).ToListAsync();
            var newList = sfaSettings.Where(o => !existingList.Contains(o.UserId + "_" + o.ProviderId.ToString())).ToList();

            foreach (var item in newList)
            {
                var newSettings = new UserOTPSetting()
                {
                    UserId = item.UserId,
                    ProviderId = item.ProviderId,
                    Secret = OTPAlgorithm.GenerateKey()
                };

                newSettings.SetAudit(userProfile.UserId, userProfile.UserName, true, true);
                dbSet.Add(newSettings);
            }
        }
    }
}
