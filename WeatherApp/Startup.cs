using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace WeatherApp
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public IHostingEnvironment Environ { get; }
        public ILoggerFactory LogFactory { get; }

        public Startup(IHostingEnvironment env, IConfiguration configuration, ILoggerFactory loggerFactory)
        {
            Configuration = configuration;
            Environ = env;
            LogFactory = loggerFactory;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var logger = LogFactory.CreateLogger<Startup>();

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            string OWMKey = "";
            string MongoURI = "";

            if (Environ.IsDevelopment())
            {
                logger.LogDebug("OWMKey=" + Configuration["OWM_KEY"]);
                logger.LogDebug("MongoURI=" + Configuration["MONGO_URI"]);
                OWMKey = Configuration["OWM_KEY"];
                MongoURI = Configuration["MONGO_URI"];
            }
            else if (Environ.IsProduction())
            {
                OWMKey = System.Environment.GetEnvironmentVariable("OWM_KEY");
                MongoURI = System.Environment.GetEnvironmentVariable("MONGO_URI");
            }
            else
            {
                logger.LogError("fail to get credentials!");
            }

            services.AddSingleton<OWMHandler>(new OWMHandler(OWMKey));
            services.AddSingleton<CityModel>(new CityModel(MongoURI));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }

            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action}/{param?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
