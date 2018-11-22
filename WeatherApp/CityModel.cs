using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;

namespace WeatherApp
{
    public class CityModel
    {
        // TODO study how to do these things professionally
        public static AppFront.CityList.City[] LoadShortCityList()
        {
            String uri = String.Format("mongodb://{0}:{1}@ds044587.mlab.com:44587/weatherapp",
                "weather_app", "zoo1234");
            var client = new MongoClient(uri);
            var database = client.GetDatabase("weatherapp");
            var collection = database.GetCollection<BsonDocument>("shortcity");
            var cursor = collection.Find(new BsonDocument()).ToCursor();
            var list = new LinkedList<AppFront.CityList.City>();
            foreach (var document in cursor.ToEnumerable())
            {
                using (var stringWriter = new StringWriter())
                {
                    using (var jsonWriter = new MongoDB.Bson.IO.JsonWriter(stringWriter))
                    {
                        var context = BsonSerializationContext.CreateRoot(jsonWriter);
                        collection.DocumentSerializer.Serialize(context, document);
                        var line = stringWriter.ToString();
                        var cityBson = BsonDocument.Parse(line);
                        var ct = new AppFront.CityList.City();
                        ct.Id = cityBson.GetValue("id").AsInt32; // why I can't cast it to Int64?
                        ct.Name = cityBson.GetValue("name").AsString;
                        ct.Country = cityBson.GetValue("country").AsString;
                        var coordDoc = cityBson.GetValue("coord").AsBsonDocument;
                        ct.Lon = coordDoc.GetValue("lon").AsDouble;
                        ct.Lat = coordDoc.GetValue("lat").AsDouble;
                        list.AddLast(ct);
                    }
                }
            }

            return list.ToArray();
        }
    }
}
