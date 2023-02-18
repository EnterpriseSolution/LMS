using System;
using System.Collections.Generic;
using System.Text;

namespace Yokogawa.LMS.Platform.Core.DTOs
{
    public class OrganizationDto
    {
        public string LocationId { get; set; }
        public string Name { get; set; }
        public string Domain { get; set; }
        public Guid WebsiteId { get; set; }
        public bool IsAzureADAccount { get; set; }
    }
}
