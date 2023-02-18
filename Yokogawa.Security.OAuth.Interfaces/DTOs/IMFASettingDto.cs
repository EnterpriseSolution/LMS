using System;
using System.Collections.Generic;
using System.Text;

namespace Yokogawa.Security.OAuth.Interfaces
{
    public interface IMFASettingDto
    {
        
        int ProviderId { get; set; }
        string Name{get;set;}
        string Id { get; set; }
        string Secret { get; set; }
       // string PinCode { get; set; }
        string Url { get; set; }
        string UserId { get; set; }
        int HasSecret { get; set; }
        string ClientId { get; set; }

    }

    /*public enum MFAProviderType { 
        TOKEN = 0,
        EMAIL =1
    }*/
}
