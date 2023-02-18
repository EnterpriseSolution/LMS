using System;
using System.Collections.Generic;
using System.Text;
using System.Xml.Linq;
using System.Xml.Serialization;

namespace Yokogawa.Data.Infrastructure.Utils.Excel.Elements
{
    [XmlRoot(ElementName = "column")]
    public class Column
    {
        [XmlAttribute(AttributeName = "name")]
        public string Name { get; set; }
        [XmlText]
        public string Text { get; set; }

        [XmlAttribute(AttributeName = "rowNo")]
        public string RowNo { get; set; }
        [XmlAttribute(AttributeName = "format")]
        public string Format { get; set; }

        [XmlAttribute(AttributeName = "dataType")]
        public string DataType { get; set; }
    }
}
