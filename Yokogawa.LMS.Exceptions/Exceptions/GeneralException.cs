using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace Yokogawa.LMS.Exceptions
{
   public class GeneralException : BaseCustomException
    {
        public GeneralException(string message) : base(message, (int)HttpStatusCode.InternalServerError)
        {
        }
    }
}
