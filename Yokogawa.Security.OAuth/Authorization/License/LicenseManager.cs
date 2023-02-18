using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace Yokogawa.Security.License
{
    public class LicenseManager
    {
        public static LicenseInfo LoadLicenseFile(string fileName)
        {
            LicenseInfo license = new LicenseInfo() { AppInfo = new List<string>() };
            
            try
            {
                FileStream fs = File.Open(fileName, FileMode.Open, FileAccess.Read, FileShare.Read);
                BinaryReader reader = new BinaryReader(fs, Encoding.Unicode);
                license.Key= reader.ReadString();
                license.strExpiredDate = reader.ReadString();
                string op1 = reader.ReadString();
                string op2 = reader.ReadString();
                string op3 = reader.ReadString();
                license.AppInfo.Add(op1);
                license.AppInfo.Add(op2);
                license.AppInfo.Add(op3);

                reader.Close();
                fs.Close();

            }
            catch (Exception ex)
            {
                license.Error= ex.Message;
            }

            return license;
        }
        public static LicenseType ReadLicenseFile(string fileName,string identityKey,string appId,out DateTime expiryDate,out string option1, out string option2, out string option3,out string error)
        {
            LicenseType type = LicenseType.Invalid;
            expiryDate = DateTime.MinValue;
            option1 = string.Empty;
            option2 = string.Empty;
            option3 = string.Empty;
            error = string.Empty;

            try
            {
                LicenseInfo license = LoadLicenseFile(fileName);
                var result = license.Verify(identityKey, appId,out type);
                expiryDate = result.ExpiredDate;
                option1 = result.AppInfo[0];
                option2 = result.AppInfo[1];
                option3 = result.AppInfo[2];
            }
            catch (Exception ex)
            {
                error = ex.Message;
            }

            return type;
        }
        public static string GenerateLicenseFile(string fileName,string identityKey, string appId, DateTime? expiryDate, string option1, string option2, string option3)
        {
            try
            {
                
                string strExpiryDate =expiryDate.HasValue? expiryDate.Value.ToString("yyyy-MM-dd") : "Unlimited";
                strExpiryDate= string.Format("{0}{1}", identityKey, strExpiryDate);
                option1= string.Format("{0}{1}", identityKey, option1);
                option2 = string.Format("{0}{1}", identityKey, option2);
                option3 = string.Format("{0}{1}", identityKey, option3);
                string licenseKey = CEncrypt.Encrypt(identityKey.ToLower(), appId);
                string enExpiryDate = CEncrypt.Encrypt(strExpiryDate, appId);
                string enOption1 = CEncrypt.Encrypt(option1, appId);
                string enOption2 = CEncrypt.Encrypt(option2, appId);
                string enOption3 = CEncrypt.Encrypt(option3, appId);


                //write file
                FileStream fs = File.Create(fileName);
                BinaryWriter writer = new BinaryWriter(fs, Encoding.Unicode);
                writer.Write(licenseKey);
                writer.Write(enExpiryDate);
                writer.Write(enOption1);
                writer.Write(enOption2);
                writer.Write(enOption3);
                writer.Close();
                fs.Close();
                return string.Empty;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }


    }
}
