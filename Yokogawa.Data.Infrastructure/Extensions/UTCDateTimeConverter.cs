using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;
using System.Text.Json;
using Yokogawa.Data.Infrastructure.Utils;

namespace Yokogawa.Data.Infrastructure.Extensions
{
    public class UTCDateTimeConverter : JsonConverter<DateTime>
    {
        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return DateTime.Parse(reader.GetString()).ToUniversalTime();
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            //writer.WriteStringValue(value.ToUniversalTime().ToIso8601String());
            writer.WriteStringValue(value.ToIso8601String());
        }
    }
}
