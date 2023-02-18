using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace Yokogawa.LMS.Exceptions
{
   public class ConflictException : BaseCustomException
    {
        public ConflictException(string message) : base(message, (int)HttpStatusCode.Conflict)
        {
        }
    }
}
