using System;
using System.Collections.Generic;
using System.Text;
using System.Xml.Linq;
using System.Xml.Serialization;

namespace Yokogawa.Data.Infrastructure.Utils.Excel.Elements
{
    [XmlRoot(ElementName = "FieldArea")]
    public class FieldArea
    {
        [XmlAttribute(AttributeName = "name")]
        public string Name { get; set; }
        [XmlAttribute(AttributeName = "rowStart")]
        public string RowStart { get; set; }
        [XmlAttribute(AttributeName = "rowEnd")]
        public string RowEnd { get; set; }
        [XmlAttribute(AttributeName = "colStart")]
        public string ColStart { get; set; }
        [XmlAttribute(AttributeName = "colEnd")]
        public string ColEnd { get; set; }
        [XmlText]
        public string Text { get; set; }
    }
}
