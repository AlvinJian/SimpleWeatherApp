using System;

namespace WeatherApp
{
    public class WeatherData
    {
        public string City { get; set; }
        public string Country { get; set; }
        public double Lat { get; set; }
        public double Lon { get; set; }
        public double Temperature { get; set; }
        public double Humidity { get; set; }
        public string Weather { get; set; }

        public string Code { get; set; }
    }
}