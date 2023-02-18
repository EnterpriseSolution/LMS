using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Security.Cryptography;
using Yokogawa.Security.OAuth.Interfaces;
using Microsoft.AspNetCore.Authentication;

namespace Yokogawa.Security.OAuth.Interfaces
{
    public static class EncryptUtility
    {
        public static string GetHash(string input)
        {
            HashAlgorithm hashAlgorithm = new SHA256CryptoServiceProvider();

            byte[] byteValue = System.Text.Encoding.UTF8.GetBytes(input);

            byte[] byteHash = hashAlgorithm.ComputeHash(byteValue);

            return Convert.ToBase64String(byteHash);
        }

        public static string CreateSecret()
        {
            var key = new byte[32];
            RNGCryptoServiceProvider.Create().GetBytes(key);
            return Base64UrlTextEncoder.Encode(key);
            
        }
    }
}
