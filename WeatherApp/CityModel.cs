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

        public AppFront.CityList.City[] GetShortCityList()
        {
            var collection = database.GetCollection<BsonDocument>("shortcity");
            return DoSearch(collection, new BsonDocument());
        }

        public AppFront.CityList.City[] StartWith(string keyword)
        {
            string pattern = String.Format("(?i)^{0}", keyword);
            var startWithRegex = new BsonRegularExpression(pattern);
            var filter = new BsonDocumentFilterDefinition<BsonDocument>(
                new BsonDocument("name", startWithRegex));
            var collection = database.GetCollection<BsonDocument>("allcity");
            return DoSearch(collection, filter);
        }

        public AppFront.CityList.City[] DoSearch(IMongoCollection<BsonDocument> collection,
            FilterDefinition<BsonDocument> filter)
        {
            var cursor = collection.Find<BsonDocument>(filter).ToCursor();
            var list = new LinkedList<AppFront.CityList.City>();
            foreach (var cityBson in cursor.ToEnumerable())
            {
                var ct = new AppFront.CityList.City();
                ct.Id = cityBson.GetValue("id").AsInt32; // why I can't cast it to Int64?
                ct.Name = cityBson.GetValue("name").AsString;
                ct.Country = cityBson.GetValue("country").AsString;
                var coordDoc = cityBson.GetValue("coord").AsBsonDocument;
                ct.Lon = coordDoc.GetValue("lon").AsDouble;
                ct.Lat = coordDoc.GetValue("lat").AsDouble;
                list.AddLast(ct);
            }

            return list.ToArray();
        }
    }
}
