using System;
using System.Collections.Generic;
using System.Text;
using System.Xml.Linq;
using System.Xml.Serialization;

namespace Yokogawa.Data.Infrastructure.Utils.Excel.Elements
{
    [XmlRoot(ElementName = "List")]
    public class List
    {
        [XmlElement(ElementName = "RowDefinition")]
        public Row RowDefinition { get; set; }
        public List<Row> Rows { get; set; }
        [XmlAttribute(AttributeName = "name")]
        public string Name { get; set; }
        [XmlAttribute(AttributeName = "MultipleSheet")]
        public string MultipleSheet { get; set; }
        [XmlAttribute(AttributeName = "rowStart")]
        public string RowStart { get; set; }
        [XmlAttribute(AttributeName = "rowEnd")]
        public string RowEnd { get; set; }
    }
}
