using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.InteropServices;
using System.Reflection;

namespace Yokogawa.Security.License
{
    public class ApplicationInfo
    {
        public static string GetApplicationId(Type type) {
            return Assembly.GetAssembly(type).GetCustomAttribute<GuidAttribute>().Value;
        }
    }
}
