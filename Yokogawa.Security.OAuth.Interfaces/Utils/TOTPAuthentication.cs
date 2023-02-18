using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Yokogawa.Security.OAuth.Interfaces
{
    public class TOTPAuthentication
    {
        private readonly Func<DateTime> NowFunc; 
        private readonly int IntervalSeconds;

        public int EffectiveSeconds
        {
            get
            {
                return IntervalSeconds;
            }
        }

        public TOTPAuthentication(Func<DateTime> nowFunc = null, int intervalSeconds = 30)
        {
            NowFunc = nowFunc;
            IntervalSeconds = intervalSeconds;
        }

        /// <summary>        
        /// Generates One-Time Password.        
        /// </summary>        
        /// <param name="secret">Shared Secret</param>        
        /// <returns>OTP</returns>        
        public string GenerateCode(string secret)        
        {
            return GenerateCode(secret, NowFunc());        
        }        
        
        /// <summary>        
        /// Generates One-Time Password.        
        /// </summary>        
        /// <param name="secret">Shared Secret</param>        
        /// <param name="date">Time to use as challenge</param>        
        /// <returns>OTP</returns>        
        public string GenerateCode(string secret, DateTime date)       
        {            
            return OTPAlgorithm.GetCodeInternal(secret, (ulong)GetInterval(date));        
        }

        private long GetInterval(DateTime dateTime) 
        { 
            TimeSpan ts = (dateTime.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)); 
            return (long)ts.TotalSeconds / IntervalSeconds; 
        }


        /// <summary>        
        /// Checks if the passed code is valid.        
        /// </summary>        
        /// <param name="secret">Shared Secret</param>        
        /// <param name="code">OTP</param>        
        /// <param name="user">The user</param>        
        /// <param name="usedDateTime">Matching time if successful</param>        
        /// <returns>true if code matches</returns>        
        public bool VerifyCode(string secret, string code,  out DateTime usedDateTime)        
        {            
            var baseTime = NowFunc();            
            DateTime successfulTime = DateTime.MinValue;   
         
            // We need to do this in constant time            
            var codeMatch = false;            
            for (int i = -2; i <= 1; i++)           
            {                
                var checkTime = baseTime.AddSeconds(IntervalSeconds * i);                
                var checkInterval = GetInterval(checkTime);
                if (OTPAlgorithm.ConstantTimeEquals(GenerateCode(secret, checkTime), code))                
                {                    
                    codeMatch = true;                    
                    successfulTime = checkTime;                    
                }            
            }            
            
            usedDateTime = successfulTime;            
            return codeMatch;        
        }        
        
        /// <summary>        
        /// Checks if the passed code is valid.        
        /// </summary>        
        /// <param name="secret">Shared Secret</param>        
        /// <param name="code">OTP</param>        
        /// <returns>true if code matches</returns>        
        public bool VerifyCode(string secret, string code)        
        {            
            DateTime successfulTime = DateTime.MinValue;
            return VerifyCode(secret, code,out successfulTime);        
        }        
        

    }
}
