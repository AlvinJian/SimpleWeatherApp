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
    "Rain": "dodgerblue",
    "Clouds": "lightgray",
    "Default": "azure"
}

export const IconMap = {
    "Snow": require("./icons/weather-snow-symbolic.svg"),
    "Clear": require("./icons/weather-clear-symbolic.svg"),
    "Mist": require("./icons/weather-fog-symbolic.svg"),
    "Fog": require("./icons/weather-fog-symbolic.svg"),
    "Rain": require("./icons/weather-showers-symbolic.svg"),
    "Clouds": require("./icons/weather-overcast-symbolic.svg"),
    "Default": require("./icons/unknown-symbolic.svg")
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
    "Rain": require("./backgrounds/weather-showers.jpg"),
    "Clouds": require("./backgrounds/weather-overcast.jpg")
}