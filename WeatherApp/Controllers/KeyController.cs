using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AppFront;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WeatherApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KeyController : ControllerBase
    {
        private IDictionary<string, string> KeyRepo;

        public KeyController(IDictionary<string,string> dict)
        {
            KeyRepo = dict;
        }

        [HttpGet("GMapJs")]
        public ActionResult<string> GetGoogleMapKey()
        {
            if (KeyRepo.ContainsKey(KeyField.GoogleMapJs))
            {
                return Ok(KeyRepo[KeyField.GoogleMapJs]);
            }
            else
            {
                return NotFound();
            }
        }
    }
}