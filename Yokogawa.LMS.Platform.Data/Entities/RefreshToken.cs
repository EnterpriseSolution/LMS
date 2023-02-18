using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities.Base;

namespace Yokogawa.LMS.Platform.Data.Entities
{
    public partial class RefreshToken:Entity<string>
    {
        public string UserId { get; set; }
        public Guid ClientId { get; set; }
        public string ProtectedTicket { get; set; }
        public System.DateTime IssuedUtc { get; set; }
        public System.DateTime ExpiresUtc { get; set; }

        public Client Client { get; set; }
    }
}
