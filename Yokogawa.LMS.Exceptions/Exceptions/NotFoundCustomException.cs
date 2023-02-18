using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace Yokogawa.LMS.Exceptions
{
   public class NotFoundCustomException : BaseCustomException
    {
        public NotFoundCustomException(string message, string description="") : base(message, (int)HttpStatusCode.NotFound)
        {
        }
    }
}
