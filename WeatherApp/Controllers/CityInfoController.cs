using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using City;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WeatherApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CityInfoController : ControllerBase
    {
        private static OWMCity[] Cities = null;

        [Route("AllList/")]
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
                l.AddLast(_c);
            }
            var ret = new AppFront.CityList();
            ret.Code = AppFront.ReturnCode.GOOD;
            ret.List = l.ToArray();
            return ret;
        }
    }
}