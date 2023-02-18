using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Management;
using System.Net.NetworkInformation;

namespace Yokogawa.Security.License
{
    public class MachineInfo
    {
        public static string GetNetworkCardIdOrCPUId()
        {
            string result = string.Empty;
            var tmp = NetworkInterface.GetAllNetworkInterfaces();
            foreach (NetworkInterface nic in tmp)
            {
                //if (nic.OperationalStatus == OperationalStatus.Up)
                if ((nic.NetworkInterfaceType != NetworkInterfaceType.Loopback) &&
                    (nic.NetworkInterfaceType != NetworkInterfaceType.Tunnel))
                {
                    if ((nic.Description.IndexOf("virtual", StringComparison.OrdinalIgnoreCase) == -1) &&
                        (nic.Name.IndexOf("virtual", StringComparison.OrdinalIgnoreCase) == -1) &&
                        (nic.Description.IndexOf("Yokogawa", StringComparison.OrdinalIgnoreCase) == -1))
                    {
                        PhysicalAddress pa = nic.GetPhysicalAddress();
                        result = pa.ToString();
                        break;
                    }
                }
            }

            if (string.IsNullOrEmpty(result))
            {
                ManagementObjectSearcher MySearcher = new ManagementObjectSearcher("SELECT * FROM Win32_Processor");
                ManagementObjectCollection cpus = MySearcher.Get();

                foreach (ManagementObject instance in cpus)
                {
                    if ((instance.Properties != null) && (instance.Properties["ProcessorId"] != null) && (instance.Properties["ProcessorId"].Value != null))
                    {
                        result = instance.Properties["ProcessorId"].Value.ToString();
                        break;
                    }
                }
            }
            return result;
        }
    }
}
