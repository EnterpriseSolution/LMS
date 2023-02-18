using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Security.Cryptography;

namespace Yokogawa.Security.OAuth.Interfaces
{
    public class OTPAlgorithm
    {
        //private static readonly RNGCryptoServiceProvider Random = new RNGCryptoServiceProvider();

        private static readonly int KeyLength = 16; 
        private static readonly string DefaultAvailableKeyChars = "A2BCD4EV5GHIJ6KLWN7OPZRSTU3FMXYQ";
        private static string AvailableKeyChars = DefaultAvailableKeyChars;

        protected static int RandomInt(int seed,int max)
        {
           Random random = seed == 0 ? new Random():new Random(seed); 
           return random.Next(0, max);
        }

        public static void ChangeKeyCharsWithRandomOrder(int length)
        {
            var keyChars = new char[length];
            int index = RandomInt(0, length-1);
            index = index == 0 ? length / 3 : (index == length - 1 ? index / 4 : index);

            string part1 = AvailableKeyChars.Substring(0, index);
            string part2 = AvailableKeyChars.Substring(index, length - index);

            AvailableKeyChars = part2 + part1;
        }

        public static string GenerateKey() 
        {
            var keyChars = new char[KeyLength];
            int seed = 0;
            ChangeKeyCharsWithRandomOrder(DefaultAvailableKeyChars.Length);

            for (int i = 0; i < keyChars.Length; i++) 
            { 
                keyChars[i] = AvailableKeyChars[RandomInt(seed,AvailableKeyChars.Length)];
                seed += ((int)keyChars[i])*(i+1);
            } 
       
            return new String(keyChars);
        }

        public static string GetCodeInternal(string secret, ulong challengeValue) 
        { 
            ulong chlg = challengeValue; 
            byte[] challenge = new byte[8];
 
            for (int j = 7; j >= 0; j--) 
            { 
                challenge[j] = (byte)((int)chlg & 0xff); 
                chlg >>= 8; 
            } 
            
            var key = Base32Encoding.ToBytes(secret); 

            for (int i = secret.Length; i < key.Length; i++) 
            { 
                key[i] = 0; 
            }
 
            HMACSHA1 mac = new HMACSHA1(key); 
            var hash = mac.ComputeHash(challenge); 
            int offset = hash[hash.Length - 1] & 0xf; 
            int truncatedHash = 0; 

            for (int j = 0; j < 4; j++) 
            { 
                truncatedHash <<= 8; truncatedHash |= hash[offset + j]; 
            } 

            truncatedHash &= 0x7FFFFFFF; 
            truncatedHash %= 1000000; 
            string code = truncatedHash.ToString(); 
            return code.PadLeft(6, '0'); 
        }

        public static bool ConstantTimeEquals(string a, string b) 
        { 
            uint diff = (uint)a.Length ^ (uint)b.Length; 
            
            for (int i = 0; i < a.Length && i < b.Length; i++) 
            { 
                diff |= (uint)a[i] ^ (uint)b[i]; 
            } 

            return diff == 0; 
        }

    }
}
