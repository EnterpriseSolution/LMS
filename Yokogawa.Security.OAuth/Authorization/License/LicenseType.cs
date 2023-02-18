using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Yokogawa.Security.License
{
    public enum LicenseType
    {
        Invalid,
        Expired,
        Valid,
        Forever

    }

    public enum IdentityType {
        ANY=0,
        HOST,
        DEVICE,
        MACHINENAME
    }

    public class CustomResult
    {
        public int Code
        {
            get; set;
        }
        public string Message { get; set; }
        public List<string> AppInfo { get; set; }
        public DateTime ExpiredDate { get; set; }

    }

    public class LicenseInfo
    {
        public string Key { get; set; }
        public string AppId { get; set; }
        public string strExpiredDate { get; set; }
        public DateTime ExpiredDate
        {
            get
            {
                if (strExpiredDate == "Unlimited")
                    return DateTime.MaxValue;
                else if (!string.IsNullOrEmpty(strExpiredDate))
                    return DateTime.Parse("yyyy-MM-dd");
                else
                    return DateTime.MinValue;
            }
        }
        public List<string> AppInfo { get; set; }
        public string Error { get; set; }
        public CustomResult Verify(string identityKey, string appId, out LicenseType type)
        {
            CustomResult result = new CustomResult() { Code = 200, AppInfo = new List<string>() };
            identityKey = identityKey.ToLower();
            type = LicenseType.Invalid;
            var identityKey2 = CEncrypt.Decrypt(this.Key, appId);
            if (identityKey == identityKey2)
            {
                int len = identityKey.Length;
                string expiryDate = CEncrypt.Decrypt(this.strExpiredDate, appId);
                expiryDate = expiryDate.StartsWith(identityKey) ? expiryDate.Substring(len) : expiryDate;

                foreach (string option in this.AppInfo)
                {
                    string temp = CEncrypt.Decrypt(option, appId);
                    temp = temp.StartsWith(identityKey) ? temp.Substring(len) : temp;
                    result.AppInfo.Add(temp);
                }

                if (expiryDate == "Unlimited")
                {
                    type = LicenseType.Forever;
                    result.ExpiredDate = DateTime.MaxValue;
                }
                else
                {
                    try
                    {
                        var date = DateTime.Parse(expiryDate);
                        if (date.AddDays(1) < DateTime.Now)
                        {
                            type = LicenseType.Expired;
                        }
                        else
                        {
                            type = LicenseType.Valid;
                        }

                        result.ExpiredDate = date;
                    }
                    catch { }
                }

            }

            if (type == LicenseType.Expired || type == LicenseType.Invalid)
            {
                result.Code = 401;
                result.Message = type.ToString() + " License";
            }

            return result;
        }

    }
}
