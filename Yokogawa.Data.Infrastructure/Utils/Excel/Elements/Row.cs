using System;
using System.Collections.Generic;
using System.Text;
using System.Xml.Linq;
using System.Xml.Serialization;

namespace Yokogawa.Data.Infrastructure.Utils.Excel.Elements
{
    [XmlRoot(ElementName = "row")]
    public class Row
    {
        [XmlElement(ElementName = "column")]
        public List<Column> Columns { get; set; }

        public int RowNo { get; set; }

    }
}
