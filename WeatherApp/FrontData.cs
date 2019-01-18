/**
 * the data structure passed to the front-end.
 */

namespace AppFront
{
    public static class ReturnCode
    {
        public const string BAD = "BAD";
        public const string GOOD = "GOOD";
    }

    public static class KeyField
    {
        public const string GoogleMapJs = "GMapJs";
    }

    public struct FrontData
    {
        public string City { get; set; }
        public string Country { get; set; }
        public double Temperature { get; set; }
        public double TemperatureMin { get; set; }
        public double TemperatureMax { get; set; }
        public double Pressure { get; set; }
        public double Humidity { get; set; }
        public string Weather { get; set; }

        public string Code { get; set; }
    }

    public struct ForecastData
    {
        public string Code { get; set; }

        public string City { get; set; }
        public string Country { get; set; }

        public Data[] Forecasts { get; set; }

        public struct Data
        {
            public double Temperature { get; set; }
            public double TemperatureMin { get; set; }
            public double TemperatureMax { get; set; }
            public double Humidity { get; set; }
            public string Weather { get; set; }
            public double Pressure { get; set; }
            public string Date { get; set; }
        }
    }
}