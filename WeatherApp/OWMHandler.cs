using System;
using System.Collections.Generic;

using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Text;
using System.Net;
using System.IO;

namespace OWM
{

    public partial class OWMResponse
    {
        [JsonProperty("coord")]
        public Coord Coord { get; set; }

        [JsonProperty("weather")]
        public Weather[] Weather { get; set; }

        [JsonProperty("base")]
        public string Base { get; set; }

        [JsonProperty("main")]
        public Main Main { get; set; }

        [JsonProperty("visibility")]
        public long Visibility { get; set; }

        [JsonProperty("wind")]
        public Wind Wind { get; set; }

        [JsonProperty("clouds")]
        public Clouds Clouds { get; set; }

        [JsonProperty("rain")]
        public Rain Rain { get; set; }

        [JsonProperty("snow")]
        public Snow Snow { get; set; }

        [JsonProperty("dt")]
        public long Dt { get; set; }

        [JsonProperty("sys")]
        public Sys Sys { get; set; }

        [JsonProperty("id")]
        public long Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("cod")]
        public long Cod { get; set; }
    }

    public partial class Clouds
    {
        [JsonProperty("all")]
        public long All { get; set; }
    }

    public partial class Rain
    {
        [JsonProperty("1h", NullValueHandling = NullValueHandling.Ignore)]
        public double? OneHour { get; set; }

        [JsonProperty("2h", NullValueHandling = NullValueHandling.Ignore)]
        public double? TwoHour { get; set; }

        [JsonProperty("3h", NullValueHandling = NullValueHandling.Ignore)]
        public double? ThreeHour { get; set; }
    }

    public partial class Snow
    {
        [JsonProperty("1h", NullValueHandling = NullValueHandling.Ignore)]
        public double? OneHour { get; set; }

        [JsonProperty("2h", NullValueHandling = NullValueHandling.Ignore)]
        public double? TwoHour { get; set; }

        [JsonProperty("3h", NullValueHandling = NullValueHandling.Ignore)]
        public double? ThreeHour { get; set; }
    }

    public partial class Coord
    {
        [JsonProperty("lon")]
        public double Lon { get; set; }

        [JsonProperty("lat")]
        public double Lat { get; set; }
    }

    public partial class Main
    {
        [JsonProperty("temp")]
        public double Temp { get; set; }

        [JsonProperty("pressure")]
        public long Pressure { get; set; }

        [JsonProperty("humidity")]
        public long Humidity { get; set; }

        [JsonProperty("temp_min")]
        public double TempMin { get; set; }

        [JsonProperty("temp_max")]
        public double TempMax { get; set; }
    }

    public partial class Sys
    {
        [JsonProperty("type")]
        public long Type { get; set; }

        [JsonProperty("id")]
        public long Id { get; set; }

        [JsonProperty("message")]
        public double Message { get; set; }

        [JsonProperty("country")]
        public string Country { get; set; }

        [JsonProperty("sunrise")]
        public long Sunrise { get; set; }

        [JsonProperty("sunset")]
        public long Sunset { get; set; }
    }

    public partial class Weather
    {
        [JsonProperty("id")]
        public long Id { get; set; }

        [JsonProperty("main")]
        public string Main { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("icon")]
        public string Icon { get; set; }
    }

    public partial class Wind
    {
        [JsonProperty("speed")]
        public double Speed { get; set; }

        [JsonProperty("deg")]
        public long Deg { get; set; }
    }

    public partial class OwnResponse
    {
        public static OwnResponse FromJson(string json) => JsonConvert.DeserializeObject<OwnResponse>(json, OWM.Converter.Settings);
    }

    public static class Serialize
    {
        public static string ToJson(this OwnResponse self) => JsonConvert.SerializeObject(self, OWM.Converter.Settings);
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

    public class OWMHandler
    {
        private static string API_KEY = "6d0f3bbd5083fef517dd12ee2cfc9c62";
        private static string END_POINT = "http://api.openweathermap.org/data/2.5/weather";

        private String Unit; 

        public OWMHandler() {
            Unit = "imperial";
        }

        public OWMResponse GetResponse(String lat, String lon)
        {
            if (!IsFloatOrInt(lat) || !IsFloatOrInt(lon)) return null;
            StringBuilder builder = new StringBuilder(END_POINT);
            builder.Append(String.Format("?lat={0}&lon={1}&appid={2}&units={3}",
                lat, lon, API_KEY, Unit));
            HttpWebRequest apiRequest = WebRequest.Create(builder.ToString()) as HttpWebRequest;
            string apiResponse = "";
            using (HttpWebResponse response = apiRequest.GetResponse() as HttpWebResponse)
            {
                var reader = new StreamReader(response.GetResponseStream());
                apiResponse = reader.ReadToEnd();
            }

            return JsonConvert.DeserializeObject<OWMResponse>(apiResponse);
        }

        private bool IsFloatOrInt(string value)
        {
            int intValue;
            float floatValue;
            return Int32.TryParse(value, out intValue) || 
                float.TryParse(value, out floatValue);
        }
    }
}
