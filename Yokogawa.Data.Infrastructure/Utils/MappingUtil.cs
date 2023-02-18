using System;
using System.Collections.Generic;
using System.Text;
using System.Xml;
using System.Xml.Linq;
using System.Linq;
using System.IO;
using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Yokogawa.Data.Infrastructure.Utils
{
    public static class MappingUtil
    {
        internal const string ISO8601 = "yyyy-MM-ddTHH:mm:ssZ";

        public static DateTime ConvertStringToDateTime(string dateTimeStr,bool isUtc=false)
        {
            DateTime value = DateTime.MinValue;
            if (DateTime.TryParse(dateTimeStr, out value))
            {
                return isUtc ? value.ToUniversalTime():value;
            }
            return value;
        }

        public static string ConvertDateTimeToIso8601String(DateTime dt)
        {
            return dt.ToString(ISO8601);
        }

        public static DateTime ToUTCDateTime(this DateTime datetime, string dateTimeStr, bool throwException = true)
        {
            datetime = ConvertStringToDateTime(dateTimeStr,true);

            if (throwException)
            {
                if (datetime == DateTime.MinValue)
                    throw new Exception("Invalid DateTime format.");
            }

            return datetime;
        }

        public static DateTime? ToUTCDateTime(string dateTimeStr)
        {
            DateTime datetime = ConvertStringToDateTime(dateTimeStr,true);

            if (datetime == DateTime.MinValue)
                return null;

            return datetime;
        }

        public static string ToIso8601String(this DateTime datetime)
        {
            return datetime.ToString(ISO8601);
        }

        public static string ToIso8601String(this DateTime? datetime)
        {
            return datetime.HasValue ? datetime.Value.ToString(ISO8601) : string.Empty;
        }

        public static string ToString(this int? value)
        {
            return value.HasValue ? value.Value.ToString() : string.Empty;
        }

        public static string Base64Encode(this string plainText)
        {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return System.Convert.ToBase64String(plainTextBytes);
        }

        public static string Base64Decode(this string encodedString)
        {
            byte[] data = Convert.FromBase64String(encodedString);
            return Encoding.UTF8.GetString(data);
        }

        public static string ConvertToXML(this XElement el)
        {
            StringBuilder sb = new StringBuilder();
            XmlWriterSettings xws = new XmlWriterSettings();
            xws.OmitXmlDeclaration = true;
            xws.Indent = true;
            using (XmlWriter xw = XmlWriter.Create(sb, xws))
            {
                el.WriteTo(xw);
            }

            string xmlContent = sb.ToString();
            TextReader tr = new StringReader(xmlContent);
            XDocument doc = XDocument.Load(tr);
            doc.Root.RemoveAttributes();
            return doc.ToString();
        }

        public static XElement GetXElements<T>(IEnumerable<T> collection, string wrapperName) where T : class
        {
            return new XElement(wrapperName, collection.Select(GetXElement));
        }

        private static XElement GetXElement<T>(T item)
        {
            return new XElement(typeof(T).Name,typeof(T).GetProperties().Select(prop => new XElement(prop.Name, prop.GetValue(item, null))));
        }

        public static T GetValue<T>(this JToken jToken, string key, T defaultValue = default(T))
        {
            dynamic ret = jToken[key];
            if (ret == null) return defaultValue;
            if (ret is JObject) return JsonConvert.DeserializeObject<T>(ret.ToString());
            return (T)ret;
        }
    }
}
