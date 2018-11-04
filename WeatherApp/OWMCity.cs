// To parse this JSON data, add NuGet 'Newtonsoft.Json' then do:
//
//    using QuickType;
//
//    var owmCity = OwmCity.FromJson(jsonString);

using System;
using System.Collections.Generic;

using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace City
{

    public partial class OWMCity
    {
        [JsonProperty("id")]
        public long Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("country")]
        public string Country { get; set; }

        [JsonProperty("coord")]
        public Coord Coord { get; set; }
    }

    public partial class Coord
    {
        [JsonProperty("lon")]
        public double Lon { get; set; }

        [JsonProperty("lat")]
        public double Lat { get; set; }
    }

    public partial class OWMCity
    {
        public static OWMCity[] FromJson(string json) => JsonConvert.DeserializeObject<OWMCity[]>(json, Converter.Settings);
    }

    public static class Serialize
    {
        public static string ToJson(this OWMCity[] self) => JsonConvert.SerializeObject(self, Converter.Settings);
    }

    internal static class Converter
    {
        public static readonly JsonSerializerSettings Settings = new JsonSerializerSettings
        {
            MetadataPropertyHandling = MetadataPropertyHandling.Ignore,
            DateParseHandling = DateParseHandling.None,
            Converters = {
                new IsoDateTimeConverter { DateTimeStyles = DateTimeStyles.AssumeUniversal }
            },
        };
    }

    public partial class OWMCity
    {
        public static OWMCity[] LoadOWMCityList()
        {
            string str = System.IO.File.ReadAllText("city.shortlist.json");
            var cities = OWMCity.FromJson(str);
            return cities;
        }
    }
}
