import React, { Component } from 'react';
import { Badge } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import InputBar from './components/InputBar';
import MapView from './components/MapView'
import { OWMInputTypes } from './Config';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.paramType = OWMInputTypes.CityId;
        this.paramVal = -1;

        this.updateListeners = [];

        this.getLocation = this.getLocation.bind(this);
        this.getCurrentWeather = this.getCurrentWeather.bind(this);
        this.getForecast = this.getForecast.bind(this);
        this.updateAllData = this.updateAllData.bind(this);
        this.refreshIfNeed = this.refreshIfNeed.bind(this);
        this.registerListener = this.registerListener.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.setMapView = this.setMapView.bind(this);

        this.tempWeather = null;
        this.tempForecast = null;
        this.map = null;
    }

    setMapView(m) {
        this.map = m; 
    }

    getLocation(cb) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lat2 = lat.toFixed(4);
                const lng = position.coords.longitude;
                const lon2 = lng.toFixed(4);
                this.paramType = OWMInputTypes.GeoLocation;
                this.paramVal = "" + lat2 + "," + lon2;
                if (cb) {
                    cb(true);
                }
                if (this.map) {
                    this.map.setMarker(lat, lng);
                }
            }, (err) => { if (cb) { cb(false) } });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    onInputChange(type, value) {
        if (type === OWMInputTypes.GeoLocation) {
            for (var i = 0; i < this.updateListeners.length; ++i) {
                this.updateListeners[i]({}, {});
            }
            const cb = (success) => {
                if (success) {
                    //console.log(`get location success type=${type} value=${value}`);
                    this.tempWeather = null; this.tempForecast = null;
                    this.updateAllData();
                } else {
                    console.log("auto-detect location failed")
                }
            };
            this.getLocation(cb);
        } else if (type === OWMInputTypes.CityId) {
            const cityId = value.id;
            //console.log("cityId=" + cityId);
            this.paramType = type;
            this.paramVal = cityId;
            this.tempWeather = null; this.tempForecast = null;
            for (var i = 0; i < this.updateListeners.length; ++i) {
                this.updateListeners[i]({}, {});
            }
            this.map.setMarker(value.lat, value.lon);
            this.updateAllData();
        }
    }

    render() {
        return (
            <div>
                <Badge className="myBadge"
                    color="dark">
                    Powered by OpenWeatherMap
                </Badge>
                <Badge className="myBadge"
                    color="dark">
                    Images from The GNOME Project
                </Badge>

                <Container>
                    <Row>
                        <Col md={1} />
                        <Col md={5}>
                            <InputBar inputCb={this.onInputChange} />
                            <CurrentWeather
                                registerListener={this.registerListener} />
                        </Col>
                        <Col md={5}>
                            <MapView
                                id="myMap"
                                options={{
                                    zoom: 7
                                }}
                                setMapView={this.setMapView}>
                            </MapView>
                        </Col>
                        <Col md={1} />
                    </Row>
                    <Forecast className="forecast_deck"
                        registerListener={this.registerListener} />
                </Container>
            </div>
        );
    }
    

    getForecast() {
        var call = 'api/OWMReq/';
        if (this.paramType === OWMInputTypes.GeoLocation) {
            call += ('ForecastByGeo/' + this.paramVal);
        }
        else if (this.paramType === OWMInputTypes.CityId) {
            call += ('ForecastById/' + this.paramVal);
        }
        else {
            console.log("parameter type: " + this.paramType +
                " is not supported");
        }
        if ((this.paramType === OWMInputTypes.CityId && this.paramVal > 0) ||
            (this.paramType === OWMInputTypes.GeoLocation && this.paramVal.length > 1)) {
            fetch(call).then(response => response.json())
                .then(data => {
                    // console.log(JSON.stringify(data));
                    this.tempForecast = data;
                    this.refreshIfNeed();
                })
        }
        else {
            console.log("skip fetch");
        }
    }

    getCurrentWeather() {
        var call = 'api/OWMReq/';
        if (this.paramType === OWMInputTypes.GeoLocation) {
            call += ('WeatherByGeo/' + this.paramVal);
        }
        else if (this.paramType === OWMInputTypes.CityId) {
            call += ('WeatherById/' + this.paramVal);
        }
        else {
            console.log("parameter type: " + this.paramType +
                " is not supported");
        }
        // console.log("call: " + call);
        if ((this.paramType === OWMInputTypes.CityId && this.paramVal > 0) ||
            (this.paramType === OWMInputTypes.GeoLocation && this.paramVal.length > 1)) {
            fetch(call).then(response => response.json())
                .then(data => {
                    // console.log(JSON.stringify(data));
                    this.tempWeather = data;
                    this.refreshIfNeed();
                })
        }
        else {
            console.log("skip fetch");
        }
    }

    updateAllData() {
        this.getCurrentWeather();
        this.getForecast();
    }

    refreshIfNeed() {
        if (this.tempForecast != null && this.tempForecast != null) {
            for (var i = 0; i < this.updateListeners.length; ++i) {
                this.updateListeners[i](this.tempWeather, this.tempForecast);
            }
        }
    }

    registerListener(listener) {
        this.updateListeners.push(listener);
    }
}
