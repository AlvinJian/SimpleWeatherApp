namespace AppFront
{
    public struct CityList
    {
        public string Code { get; set; }
        public City[] List { get; set; }


        public struct City
        {
            public long Id { get; set; }
            public string Name { get; set; }
            public string Country { get; set; }
            public double Lon { get; set; }
            public double Lat { get; set; }
        }
    }
}