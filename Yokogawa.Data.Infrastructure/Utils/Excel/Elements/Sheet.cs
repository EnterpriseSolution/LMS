using System;
using System.Collections.Generic;
using System.Text;
using System.Xml.Linq;
using System.Xml.Serialization;

namespace Yokogawa.Data.Infrastructure.Utils.Excel.Elements
{
    [XmlRoot(ElementName = "sheet")]
    public class Sheet
    {
        [XmlElement(ElementName = "Field")]
        public List<Field> Fields { get; set; }
        [XmlElement(ElementName = "List")]
        public List<List> Lists { get; set; }
        [XmlElement(ElementName = "FieldArea")]
        public List<FieldArea> FieldAreas { get; set; }
        [XmlAttribute(AttributeName = "name")]
        public string Name { get; set; }

    }
}
