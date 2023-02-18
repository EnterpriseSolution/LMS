using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.Security.OAuth.Authentication
{
    public static class MFAuthentication
    {
        const int email_otp_lifetime = 600;
        public static bool Validate(string key, string otp, string authType,ref string error)
        {
            bool isValid = false;

            if (string.IsNullOrEmpty(key) || string.IsNullOrEmpty(otp))
                return isValid;

            // We need to check the passcode against the past, current, and future passcodes
            if (!string.IsNullOrWhiteSpace(authType))
            {
                switch (authType.ToLower())
                {
                    case "etoken":
                        TOTPAuthentication e_auth = new TOTPAuthentication(GetServerDateTime);
                        isValid = e_auth.VerifyCode(key, otp);
                        break;
                    case "email":
                        TOTPAuthentication m_auth = new TOTPAuthentication(GetServerDateTime, email_otp_lifetime);
                        isValid = m_auth.VerifyCode(key, otp);
                        break;
                    //case "secure_device":
                        //OTPCredential credential = OTPCredential.ConvertToOTPCredential(key);
                        //isValid = OTPAuthentication.Authenticate(credential, otp, ref error) == 0;
                        
                       // break;
                    default:
                        break;
                }
            }

            return isValid;
        }

        public static DateTime GetServerDateTime()
        {
            return DateTime.Now;
        }

        public static string CreateTokenSecret() {
            return OTPAlgorithm.GenerateKey();
        }

        public static string GenerateEmailOTP(string secret)
        {
            TOTPAuthentication m_auth = new TOTPAuthentication(GetServerDateTime, email_otp_lifetime);
            return m_auth.GenerateCode(secret);
        }
    }
}
