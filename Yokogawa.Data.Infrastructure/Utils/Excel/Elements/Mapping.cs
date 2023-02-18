using System;
using System.Collections.Generic;
using System.Text;
using System.Xml.Linq;
using System.Xml.Serialization;

namespace Yokogawa.Data.Infrastructure.Utils.Excel.Elements
{
    [XmlRoot(ElementName = "Mapping")]
    public class Mapping
    {
        [XmlElement(ElementName = "sheet")]
        public List<Sheet> Sheets { get; set; }
        [XmlAttribute(AttributeName = "id")]
        public string Id { get; set; }
        public string FileName { get; set; }


        public string Error { get; set; }
    }
}
