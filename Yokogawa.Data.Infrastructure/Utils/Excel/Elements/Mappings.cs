using System;
using System.Collections.Generic;
using System.Text;
using System.Xml.Linq;
using System.Xml.Serialization;

namespace Yokogawa.Data.Infrastructure.Utils.Excel.Elements
{
    [XmlRoot(ElementName = "Mappings")]
    public class Mappings
    {
        [XmlElement(ElementName = "Mapping")]
        public List<Mapping> MappingList { get; set; }
    }
}
