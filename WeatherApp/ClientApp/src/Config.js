export const OWMInputTypes = {
    GeoLocation: 'geo',
    CityId: 'cityId'
};

export const Symbol = {
    DegF: '°F',
    DegC: '°C',
    Percent: "%"
}

export const BackgroundColors = {
    "Snow": "ghostwhite",
    "Clear": "skyblue",
    "Mist": "lightsteelblue",
    "Fog": "lightsteelblue",
    "Haze": "lightsteelblue",
    "Rain": "dodgerblue",
    "Clouds": "lightgray",
    "Default": "azure"
}

export const IconMap = {
    "Snow": require("./icons/weather-snow-symbolic.svg"),
    "Clear": require("./icons/weather-clear-symbolic.svg"),
    "Mist": require("./icons/weather-fog-symbolic.svg"),
    "Fog": require("./icons/weather-fog-symbolic.svg"),
    "Haze": require("./icons/weather-fog-symbolic.svg"),
    "Rain": require("./icons/weather-showers-symbolic.svg"),
    "Drizzle": require("./icons/weather-showers-symbolic.svg"),
    "Clouds": require("./icons/weather-overcast-symbolic.svg"),
    "Default": require("./icons/unknown-symbolic.svg"),
    "Storm": require("./icons/weather-storm-symbolic.svg")
}

export function GetIconPath(condition) {
    if (condition in IconMap) {
        return IconMap[condition];
    }
    else {
        return IconMap.Default;
    }
}

export const BackgroundImages = {
    "Snow": require("./backgrounds/weather-snow.jpg"),
    "Clear": require("./backgrounds/weather-few-clouds.jpg"),
    "Mist": require("./backgrounds/weather-fog.jpg"),
    "Fog": require("./backgrounds/weather-fog.jpg"),
    "Haze": require("./backgrounds/weather-fog.jpg"),
    "Rain": require("./backgrounds/weather-showers.jpg"),
    "Clouds": require("./backgrounds/weather-overcast.jpg"),
    "Storm": require("./backgrounds/weather-storm.jpg")
}

/**
 * TODO
 * currently I use restriction (IP and domain name) to protect these keys.
 * I have to figure out how to switch key on deployment
 * */
export const GapiKey = {
    Dev: "AIzaSyDhfsJRh-d370hbBYZItcJVgB5oWFgmbxg",
    Deploy: "AIzaSyCj3MjsM3Qzp9mrMbv3JOmYhKpU3Kmkbxk"
}