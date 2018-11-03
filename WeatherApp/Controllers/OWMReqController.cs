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
            System.Diagnostics.Debug.WriteLine("WeatherByGeo, param=" + param);
            OWMHandler handler = new OWMHandler();
            AppFront.WeatherData data = new AppFront.WeatherData();
            string[] strs = param.Split(',');
            if (strs.Length < 2)
            {
                data.Code = AppFront.ReturnCode.BAD;
                return data;
            }
            string lat = strs[0].Trim();
            string lon = strs[1].Trim();
            var resp = handler.GetWeather(lat, lon);
            if (resp == null)
            {
                data.Code = AppFront.ReturnCode.BAD;
                return data;
            }
            data.City = resp.Name;
            data.Country = resp.Sys.Country;
            data.Humidity = resp.Main.Humidity;
            data.Temperature = resp.Main.Temp;
            data.TemperatureMin = resp.Main.TempMin;
            data.TemperatureMax = resp.Main.TempMax;
            data.Pressure = resp.Main.Pressure;
            data.Weather = resp.Weather[0].Main;
            data.Code = AppFront.ReturnCode.GOOD;
            // System.Diagnostics.Debug.WriteLine("weather=" + data.Weather);
            return data;
        }

        [Route("ForecastByGeo/{param}")]
        public AppFront.ForecastData GetForecastByGeo(string param)
        {
            System.Diagnostics.Debug.WriteLine("ForecastByGeo, param=" + param);
            OWMHandler handler = new OWMHandler();
            AppFront.ForecastData data = new AppFront.ForecastData();
            string[] strs = param.Split(',');
            if (strs.Length < 2)
            {
                data.Code = AppFront.ReturnCode.BAD;
                return data;
            }
            string lat = strs[0].Trim();
            string lon = strs[1].Trim();
            var resp = handler.GetForcast(lat, lon);
            if (resp == null)
            {
                data.Code = AppFront.ReturnCode.BAD;
                return data;
            }
            data.City = resp.City.Name;
            data.Country = resp.City.Country;

            var list = new LinkedList<AppFront.ForecastData.Data>();

            int lastDay = -1;
            foreach (var forecast in resp.Forecasts)
            {
                if (forecast.DtTxt.Day != lastDay)
                {
                    AppFront.ForecastData.Data d = new AppFront.ForecastData.Data();
                    d.Temperature = forecast.Main.Temp;
                    d.TemperatureMin = forecast.Main.TempMax;
                    d.TemperatureMin = forecast.Main.TempMin;
                    d.Humidity = forecast.Main.Humidity;
                    d.Weather = forecast.Weather[0].Main;
                    d.Pressure = forecast.Main.Pressure;
                    d.TimeStamp = forecast.DtTxt;
                    list.Append(d);
                    lastDay = forecast.DtTxt.Day;
                }
            }
            data.Forecasts = list.ToArray();
            data.Code = AppFront.ReturnCode.GOOD;

            return data;
        }
    }
}