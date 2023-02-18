using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.InteropServices;
using System.Reflection;
using System.Configuration;

namespace Yokogawa.Security.License
{
  
    public class LicenseAuthorizationProvider
    {
        private string _appId = string.Empty, _identity = string.Empty, _fileName;
        private IdentityType _identityType = IdentityType.DEVICE;
        private LicenseInfo _license;
        public string IdentityKey {
            get {
                return _identity;
            }
            set {
                _identity = value;
            }
        }

      
        public LicenseAuthorizationProvider(Type appType, string fileName, IdentityType identityType = IdentityType.DEVICE, string identity = "") {
            _appId = appType.Assembly.GetCustomAttribute<GuidAttribute>().Value;
            ChangeIdenitityType(identityType, identity);
            
            _fileName = fileName;
        }

        public void ChangeIdenitityType(IdentityType identityType,string identity) {
            _identityType = identityType;

            if (_identityType == IdentityType.DEVICE)
                _identity = MachineInfo.GetNetworkCardIdOrCPUId();
            else if (_identityType == IdentityType.MACHINENAME)
                _identity = Environment.MachineName;
            else
                _identity = identity;
        }

        public CustomResult OnAuthorization() {
            _license = _license ?? LicenseManager.LoadLicenseFile(_fileName);
            LicenseType type;
            CustomResult result = _license.Verify(_identity, _appId,out type);
            return result;
        }
    }
}
