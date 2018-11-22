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
        private MongoClient client;
        private IMongoDatabase database;

        public CityModel(string uri)
        {
            client = new MongoClient(uri);
            database = client.GetDatabase("weatherapp");
        }

        // TODO study how to do these things professionally
        public AppFront.CityList.City[] LoadShortCityList()
        {
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
