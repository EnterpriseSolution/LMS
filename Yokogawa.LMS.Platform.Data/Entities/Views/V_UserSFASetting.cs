using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    [Keyless]
    public partial class V_UserSFASetting
    {
        public string UserId { get; set; }
        public int ProviderId { get; set; }
        public string ProviderName { get; set; }
        public Guid ClientId { get; set; }
        public string Url { get; set; }
        public string PinCode { get; set; }
        public bool IsSystemProvider { get; set; }
        public int HasSecret { get; set; }
        public string Secret { get; set; }
        public Guid SettingId { get; set; }
    }
}
