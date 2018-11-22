using System.Collections.Generic;
using System.Linq;
using City;
using Microsoft.AspNetCore.Mvc;

namespace WeatherApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CityInfoController : ControllerBase
    {
        private static OWMCity[] Cities = null;

        [System.Obsolete("load data from mongodb not here")]
        public AppFront.CityList GetAllCities()
        {
            if (Cities == null)
            {
                Cities = OWMCity.LoadOWMCityList();
            }

            var l = new LinkedList<AppFront.CityList.City>();
            foreach (OWMCity c in Cities)
            {
                var _c = new AppFront.CityList.City();
                _c.Name = c.Name;
                _c.Country = c.Country;
                _c.Id = c.Id;
                _c.Lat = c.Coord.Lat;
                _c.Lon = c.Coord.Lon;
                l.AddLast(_c);
            }
            var ret = new AppFront.CityList();
            ret.Code = AppFront.ReturnCode.GOOD;
            ret.List = l.ToArray();
            return ret;
        }

        [Route("ShortList/")]
        public AppFront.CityList GetShortList()
        {
            var ret = new AppFront.CityList();
            ret.List = CityModel.LoadShortCityList();
            if (ret.List.Length > 0)
            {
                ret.Code = AppFront.ReturnCode.GOOD;
            }
            else
            {
                ret.Code = AppFront.ReturnCode.BAD;
            }

            return ret;
        }
    }
}