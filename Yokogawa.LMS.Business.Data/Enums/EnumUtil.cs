using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Reflection;
using System.Text;

namespace Yokogawa.LMS.Business.Data.Enums
{
    public static class UtilEnum
    {
        public static string GetDescription(Type enumType, int val)
        {
            string name = Enum.GetName(enumType, val);
            if (string.IsNullOrEmpty(name)) 
                return string.Empty;

            MemberInfo[] memberInfo = enumType.GetMember(name);
            if (memberInfo.Length > 0)
            {
                object[] attrs = memberInfo[0].GetCustomAttributes(typeof(DescriptionAttribute), false);
                if (attrs.Length > 0)
                {
                    name=((DescriptionAttribute)attrs[0]).Description;
                }
            }

            return name;
        }
    }
}
