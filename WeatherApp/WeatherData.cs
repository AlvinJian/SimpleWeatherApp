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