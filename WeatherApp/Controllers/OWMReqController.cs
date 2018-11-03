using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WeatherApp.Controllers
{
    [Route("api/[controller]")]
    public class OWMReqController : Controller
    {
        [Route("WeatherByGeo/{param}")]
        public AppFront.WeatherData GetWeatherByGeo(string param)
        {
            System.Diagnostics.Debug.WriteLine("param=" + param);
            OWMHandler handler = new OWMHandler();
            AppFront.WeatherData data = new AppFront.WeatherData();
            string[] strs = param.Split(',');
            if (strs.Length < 2)
            {
                data.Code = "BAD";
                return data;
            }
            string lat = strs[0].Trim();
            string lon = strs[1].Trim();
            var resp = handler.GetResponse(lat, lon);
            if (resp == null)
            {
                data.Code = "BAD";
                return data;
            }
            data.City = resp.Name;
            data.Country = resp.Sys.Country;
            data.Humidity = resp.Main.Humidity;
            data.Temperature = resp.Main.Temp;
            data.Weather = resp.Weather[0].Main;
            System.Diagnostics.Debug.WriteLine("weather=" + data.Weather);
            data.Code = "GOOD";
            return data;
        }
    }
}