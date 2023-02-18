using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.InteropServices;

namespace Yokogawa.Security.OAuth.Authentication
{
    public class OTPDB_DEFINE
    {

        public const int OTP_SUCCESS = 0;      	/* Success */

        public const int OTP_ERR_INVALID_PARAMETER = 1; /* invalid parameter */

        public const int OTP_ERR_CHECK_PWD = 2;      	/* invalid password*/

        public const int OTP_ERR_SYN_PWD = 3;      	/* fails to syncronize OTP */

        public const int OTP_C200_DEFAULT_PWD_EXPIRY_TIME = 60;

        public const int OTP_PWD_LEN = 6;

        public const int OTP_C100_PWD_RANGE = 40; //40;

        public const int OTP_C200_PWD_RANGE = 40;// 20;

        public const int OPT_INVALID_SN = 4; /*Can't find SN for current user*/

        public static string OTP_ErrDescription(int ErrNum)
        {
            string error;
            switch (ErrNum)
            {
                case 1: error = "Invalied Parameter";
                    break;
                case 2: error = "Verified Password Failed";
                    break;
                case 3: error = "Failed to syncronized OTP password";
                    break;
                case 4:
                    error = "Can't find the serial No of secure device for the current user";
                    break;
                default: error = "Error description not found";
                    break;
            }

            return error;

        }

    }

    public class OTPCredential {
        public string SN
        { get; set; }

        public string AuthKey
        { get; set; }

        public int AuthNum
        { get; set; }

        public int? LastSucc
        { get; set; }

        public int? Drift 
        { get; set; }

        public string Type
        { get; set; }

        public static OTPCredential ConvertToOTPCredential(string strDevice)
        {
            OTPCredential credential = null;
            //device.SN + ";" + device.AuthKey + ";" + device.AuthNum.ToString() + ";" + device.LastSucc.ToString() + ";" + device.Drift + ";" + device.Type;
            string[] parts = strDevice.Split(';');
            if (parts.Length == 6)
            {
                credential = new OTPCredential();
                credential.SN = parts[0];
                credential.AuthKey = parts[1];
                credential.AuthNum = int.Parse(parts[2]);
                credential.LastSucc = int.Parse(parts[3]);
                credential.Drift = int.Parse(parts[4]);
                credential.Type = parts[5];
            }

            return credential;
        }


    }

    public static class OTPAuthentication
    {

        //Wrapper
        // Place OTP_VERIFY.dll either in BIN folder or root folder
        // As OTP_Verify.dll is written in unmanage code (i.e. C++), therefore, the following method is use to reference the dll        
        [DllImport("otp_verify.dll")]
        private static extern int ITSecurity_CheckPwd(string authkey, UInt64 authnum, int authwnd, string otp, int otplen, ref UInt64 authresnum);

        [DllImport("otp_verify.dll")]
        private static extern int ITSecurity_PSW_SYN(string authkey, UInt64 authnum, string otp1, int otp1len, string otp2, int otp2len, int syncwnd, ref UInt64 authresnum);


        [DllImport("otp_verify.dll")]
        private static extern int ITSecurity_CheckPwdC200(string authkey, UInt64 t, UInt64 t0, uint x, int drift, int authwnd, UInt64 lastsucc, string otp, int otplen, ref UInt64 currsucc, ref int currdft);


        [DllImport("otp_verify.dll")]
        private static extern int ITSecurity_PSW_SYNC200(string authkey, UInt64 t, UInt64 t0, uint x, int drift, int syncwnd, UInt64 lastsucc, string otp1, int otp1len, string otp2, int otp2len, ref UInt64 currsucc, ref int currdft);

        public static int Authenticate(OTPCredential credential, string password, ref string errInfo)
        {
            int errNo = 0;

            try
            {
                if (null == credential)
                {
                    errNo = 4;
                }

                if (errNo == 0)
                {
                    switch (credential.Type)
                    {
                        case "C100":
                            errNo = Authenticate_C100(credential, password);
                            break;
                        case "C200":
                            errNo = Authenticate_C200(credential, password);
                            break;
                        default:
                            errNo = Authenticate_C100(credential, password);
                            break;
                    }
                }

                if (errNo > 0)
                {
                    errInfo = OTPDB_DEFINE.OTP_ErrDescription(errNo);
                }
            }
            catch (Exception ex)
            {
                errInfo = ex.Message;
                errNo = -1;
            }

            return errNo;
        }

        public static string SyncronizeOTP(OTPCredential credential, string pwd1, string pwd2)
        {
            string errInfo = "";
            int errNO = 0;

            try
            {

                if (null == credential)
                {
                    errNO = 4;
                }

                if (errNO == 0)
                {
                    switch (credential.Type)
                    {
                        case "C100":
                            errNO = Syncronized_C100(credential, pwd1, pwd2);
                            break;
                        case "C200":
                            errNO = Syncronized_C200(credential, pwd1, pwd2);
                            break;
                        default:
                            errNO = Syncronized_C100(credential, pwd1, pwd2);
                            break;
                    }

                }

                if (errNO != 0)
                {
                    errInfo = OTPDB_DEFINE.OTP_ErrDescription(errNO);
                }
            }
            catch (Exception ex)
            {
                errInfo = ex.Message;
            }

            return errInfo;
        }

        #region "C100"
        private static int Authenticate_C100(OTPCredential credential, string passwd)
        {
            int iRe = OTPDB_DEFINE.OTP_SUCCESS;
            ulong OTPNum = (ulong)credential.AuthNum;

            //Call ITSecurity_CheckPwd to authenticate the password supply by the user.
            // This method will return an integer result whether the authentication is successful. 
            // At the same time, a reference object is being pass in to get the number of times this OTP token had generated a password.

            iRe = ITSecurity_CheckPwd(credential.AuthKey, OTPNum, OTPDB_DEFINE.OTP_C100_PWD_RANGE, passwd, OTPDB_DEFINE.OTP_PWD_LEN, ref OTPNum);

            if (iRe == OTPDB_DEFINE.OTP_SUCCESS)
            {
                credential.AuthNum = Convert.ToInt32(OTPNum);
            }

            return iRe;

        }

        private static int Syncronized_C100(OTPCredential credential, string pwd1, string pwd2)
        {
            UInt64 authnum = 0;
            int iRe = OTPDB_DEFINE.OTP_SUCCESS;
            iRe = ITSecurity_PSW_SYN(credential.AuthKey, (ulong)credential.AuthNum, pwd1, OTPDB_DEFINE.OTP_PWD_LEN, pwd2, OTPDB_DEFINE.OTP_PWD_LEN, 200, ref authnum);

            if (iRe == OTPDB_DEFINE.OTP_SUCCESS)
            {
                credential.AuthNum = Convert.ToInt32(authnum);
            }

            return iRe;
        }

        #endregion

        #region "C200"
        private static int Authenticate_C200(OTPCredential credential, string passwd)
        {

            //Calculate timespan
            TimeSpan tsTimeSpan = DateTime.UtcNow - new DateTime(1970, 1, 1);
            ulong ulgTimeStamp = (ulong)tsTimeSpan.TotalSeconds;
            UInt64 currsucc = credential.LastSucc.HasValue ? (UInt64)credential.LastSucc.Value : 0;
            int currdft = credential.Drift.HasValue ? credential.Drift.Value : 0;
            int iRe = OTPDB_DEFINE.OTP_SUCCESS;
            int pwd_range = OTPDB_DEFINE.OTP_C200_PWD_RANGE;

            iRe = ITSecurity_CheckPwdC200(credential.AuthKey, ulgTimeStamp, 0, OTPDB_DEFINE.OTP_C200_DEFAULT_PWD_EXPIRY_TIME, currdft, pwd_range, currsucc, passwd, OTPDB_DEFINE.OTP_PWD_LEN, ref currsucc, ref currdft);

            if (iRe == OTPDB_DEFINE.OTP_SUCCESS)
            {
                credential.Drift = currdft;
                credential.LastSucc = Convert.ToInt32(currsucc);
            }

            return iRe;
        }

        private static int Syncronized_C200(OTPCredential credential, string pwd1, string pwd2)
        {
            TimeSpan tsTimeSpan = DateTime.UtcNow - new DateTime(1970, 1, 1);
            ulong ulgTimeStamp = (ulong)tsTimeSpan.TotalSeconds;
            UInt64 currsucc = credential.LastSucc.HasValue ? (UInt64)credential.LastSucc.Value : 0;
            int currdft = credential.Drift.HasValue ? credential.Drift.Value : 0;
            int iRe = OTPDB_DEFINE.OTP_SUCCESS;
            int pwd_range = OTPDB_DEFINE.OTP_C200_PWD_RANGE;


            iRe = ITSecurity_PSW_SYNC200(credential.AuthKey, ulgTimeStamp, 0, OTPDB_DEFINE.OTP_C200_DEFAULT_PWD_EXPIRY_TIME, currdft, pwd_range, currsucc, pwd1, OTPDB_DEFINE.OTP_PWD_LEN, pwd2, OTPDB_DEFINE.OTP_PWD_LEN, ref currsucc, ref currdft);

            if (iRe == OTPDB_DEFINE.OTP_SUCCESS)
            {
                credential.Drift = currdft;
                credential.LastSucc = Convert.ToInt32(currsucc);
            }

            return iRe;

        }

        #endregion
    }
}
