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
        private CityModel model = null;

        public CityInfoController(OWMHandler owmHandler, CityModel cityModel)
        {
            model = cityModel;
        }

        [Route("ShortList/")]
        public AppFront.CityList GetShortList()
        {
            var ret = new AppFront.CityList();
            ret.List = model.GetShortCityList();
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

        [Route("SearchCity/{keyword}")]
        public AppFront.CityList SearchCity(string keyword)
        {
            var ret = new AppFront.CityList();
            ret.List = model.StartWith(keyword);
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