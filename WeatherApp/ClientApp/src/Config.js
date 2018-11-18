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
    "Snow": "./icons/weather-snow-symbolic.svg",
    "Clear": "./icons/weather-clear-symbolic.svg",
    "Mist": "./icons/weather-fog-symbolic.svg",
    "Fog": "./icons/weather-fog-symbolic.svg",
    "Rain": "./icons/weather-showers-symbolic.svg",
    "Clouds": "./icons/weather-overcast-symbolic.svg",
    "Default": "./icons/unknown-symbolic.svg"
}

export function GetIconPath(condition) {
    if (condition in IconMap) {
        return IconMap[condition];
    }
    else {
        return IconMap.Default;
    }
} 