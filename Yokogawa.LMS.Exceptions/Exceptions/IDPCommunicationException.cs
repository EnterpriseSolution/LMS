using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace Yokogawa.LMS.Exceptions
{
   public class IDPCommunicationException : BaseCustomException
    {
        public IDPCommunicationException(string message) : base(message, (int)HttpStatusCode.ServiceUnavailable)
        {
        }
    }
}
