using System;
using System.Collections.Generic;
using System.Text;
using System.Xml.Linq;
using System.Xml.Serialization;

namespace Yokogawa.Data.Infrastructure.Utils.Excel.Elements
{
    [XmlRoot(ElementName = "Field")]
    public class Field
    {
        [XmlAttribute(AttributeName = "name")]
        public string Name { get; set; }
        [XmlText]
        public string Text { get; set; }

        [XmlAttribute(AttributeName = "format")]
        public string Format { get; set; }
    }
}
