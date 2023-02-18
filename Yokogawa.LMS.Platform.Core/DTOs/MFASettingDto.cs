using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.LMS.Platform.Core.DTOs
{
    public class MFASettingDto : IMFASettingDto
    {
        public string Id { get; set; }
        public int ProviderId { get; set; }
        public string Name { get; set; }

        public string Url { get; set; }
        public string Secret { get; set; }
        public string PinCode { get; set; }
        public string UserId { get; set; }
        public int HasSecret { get; set; }
        public string ClientId { get; set; }

    }
}
