using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Security.Cryptography;

namespace Yokogawa.Security.License
{
    public class SaltInfo {
        public byte[] Key { get; set; }
        public byte[] IV { get; set; }
        public SaltInfo() {
            this.Key = new byte[8];
            this.IV = new byte[8];
        }
    }
    public class CEncrypt
    {
        private static SaltInfo getKeyandIV(string text)
        {
            MD5CryptoServiceProvider MD5Hash = new MD5CryptoServiceProvider();
            SaltInfo salt = new SaltInfo();
            
            byte[] byteValue = System.Text.Encoding.UTF8.GetBytes(text);
            byte[] byteHash = MD5Hash.ComputeHash(UTF8Encoding.UTF8.GetBytes(text));
            MD5Hash.Clear();
            for (int i = 0; i < 8; i++)
                salt.Key[i] = byteHash[i];

            for (int i = 8; i < 16; i++) {
                salt.IV[i-8] = byteHash[i];
            }

            return salt;
        }

        public static string Encrypt(string text, string salt)
        { 
            DESCryptoServiceProvider des = new DESCryptoServiceProvider();

            byte[] inputByteArray = Encoding.Default.GetBytes(text);
            SaltInfo saltInfo = getKeyandIV(salt);
            des.Key = saltInfo.Key;
            des.IV = saltInfo.IV;
            MemoryStream ms = new MemoryStream();
            CryptoStream cs = new CryptoStream(ms, des.CreateEncryptor(), CryptoStreamMode.Write);
            cs.Write(inputByteArray, 0, inputByteArray.Length);
            cs.FlushFinalBlock();
            StringBuilder ret = new StringBuilder();
            foreach (byte b in ms.ToArray())
            {
                ret.AppendFormat("{0:X2}", b);
            }
            return ret.ToString();
        }

        public static string Decrypt(string text,  string salt)
        {
            
            DESCryptoServiceProvider des = new DESCryptoServiceProvider();
            int len = text.Length / 2;
            byte[] inputByteArray = new byte[len];
            for (int x = 0; x < len; x++)
            {
                int i = Convert.ToInt32(text.Substring(x * 2, 2), 16);
                inputByteArray[x] = (byte)i;
            }

            SaltInfo saltInfo = getKeyandIV(salt);
            des.Key = saltInfo.Key;
            des.IV = saltInfo.IV;
            MemoryStream ms = new MemoryStream();
            CryptoStream cs = new CryptoStream(ms, des.CreateDecryptor(), CryptoStreamMode.Write);
            cs.Write(inputByteArray, 0, inputByteArray.Length);
            cs.FlushFinalBlock();
            return Encoding.Default.GetString(ms.ToArray());
        }

       
    }
}
