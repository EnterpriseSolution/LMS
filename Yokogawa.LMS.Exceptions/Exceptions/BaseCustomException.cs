using System;
using System.Collections.Generic;
using System.Text;

namespace Yokogawa.LMS.Exceptions
{
    public class BaseCustomException : Exception
    {
        private int _code;
       // private string _description;

        public int Code
        {
            get => _code;
        }
        //public string Description
        //{
        //    get => _description;
        //}

        public BaseCustomException(string message,  int code) : base(message)
        {
            _code = code;
        }
    }
}
