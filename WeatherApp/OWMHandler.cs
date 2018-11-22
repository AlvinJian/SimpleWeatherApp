using System;
using Newtonsoft.Json;
using System.Text;
using System.Net;
using System.IO;
using Weather;
using Forecast;

namespace WeatherApp
{
    public class OWMHandler
    {
        private static string END_POINT = "http://api.openweathermap.org/data/2.5/";

        private String Unit;
        private readonly string API_KEY;

        public OWMHandler(string key) {
            Unit = "imperial";
            API_KEY = key;
        }

        public OWMWeather GetWeather(String lat, String lon)
        {
            if (!IsFloatOrInt(lat) || !IsFloatOrInt(lon)) return null;
            StringBuilder builder = new StringBuilder(END_POINT);
            builder.Append("weather");
            builder.Append(String.Format("?lat={0}&lon={1}&appid={2}&units={3}",
                lat, lon, API_KEY, Unit));
            HttpWebRequest apiRequest = WebRequest.Create(builder.ToString()) as HttpWebRequest;
            string apiResponse = "";
            using (HttpWebResponse response = apiRequest.GetResponse() as HttpWebResponse)
            {
                var reader = new StreamReader(response.GetResponseStream());
                apiResponse = reader.ReadToEnd();
            }

            return JsonConvert.DeserializeObject<OWMWeather>(apiResponse);
        }

        public OWMWeather GetWeather(long id)
        {
            StringBuilder builder = new StringBuilder(END_POINT);
            builder.Append("weather");
            builder.AppendFormat("?id={0}&appid={1}&units={2}", id, API_KEY, Unit);
            HttpWebRequest apiRequest = WebRequest.Create(builder.ToString()) as HttpWebRequest;
            string apiResponse = "";
            using (HttpWebResponse response = apiRequest.GetResponse() as HttpWebResponse)
            {
                var reader = new StreamReader(response.GetResponseStream());
                apiResponse = reader.ReadToEnd();
            }

            return JsonConvert.DeserializeObject<OWMWeather>(apiResponse);
        }

        public OWMForcast GetForcast(String lat, String lon)
        {
            if (!IsFloatOrInt(lat) || !IsFloatOrInt(lon)) return null;
            StringBuilder builder = new StringBuilder(END_POINT);
            builder.Append("forecast");
            builder.Append(String.Format("?lat={0}&lon={1}&appid={2}&units={3}", lat, lon, API_KEY, Unit));
            HttpWebRequest apiRequest = WebRequest.Create(builder.ToString()) as HttpWebRequest;

            string apiResponse = "";
            using (HttpWebResponse response = apiRequest.GetResponse() as HttpWebResponse)
            {
                var reader = new StreamReader(response.GetResponseStream());
                apiResponse = reader.ReadToEnd();
            }
            return JsonConvert.DeserializeObject<OWMForcast>(apiResponse);
        }

        public OWMForcast GetForcast(long id)
        {
            StringBuilder builder = new StringBuilder(END_POINT);
            builder.Append("forecast");
            builder.AppendFormat("?id={0}&appid={1}&units={2}", id, API_KEY, Unit);
            HttpWebRequest apiRequest = WebRequest.Create(builder.ToString()) as HttpWebRequest;

            string apiResponse = "";
            using (HttpWebResponse response = apiRequest.GetResponse() as HttpWebResponse)
            {
                var reader = new StreamReader(response.GetResponseStream());
                apiResponse = reader.ReadToEnd();
            }
            return JsonConvert.DeserializeObject<OWMForcast>(apiResponse);
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
