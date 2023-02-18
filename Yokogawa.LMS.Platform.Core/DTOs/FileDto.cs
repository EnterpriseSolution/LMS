using System;
using System.Collections.Generic;
using System.Text;
using System.IO;

namespace Yokogawa.LMS.Platform.Core.DTOs
{
    public class FileDto
    {
        public string FileName { get; set; }
        public MemoryStream stream { get; set; }
    }
}
