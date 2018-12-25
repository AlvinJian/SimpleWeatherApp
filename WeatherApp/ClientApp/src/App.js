import React, { Component } from 'react';
import { Badge } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import InputBar from './components/InputBar';
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

        this.tempWeather = null;
        this.tempForecast = null;
    }

    getLocation(cb) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude.toFixed(2);
                const lon = position.coords.longitude.toFixed(2);
                this.paramType = OWMInputTypes.GeoLocation;
                this.paramVal = "" + lat + "," + lon;
                if (cb) {
                    cb(true);
                }
            }, (err) => { if (cb) { cb(false) } });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    onInputChange(type, value) {
        if (type === OWMInputTypes.GeoLocation) {
            const cb = (success) => {
                if (success) {
                    //console.log(`get location success type=${type} value=${value}`);
                    this.paramType = type;
                    this.tempWeather = null; this.tempForecast = null;
                    for (var i = 0; i < this.updateListeners.length; ++i) {
                        this.updateListeners[i]({}, {});
                    }
                    this.updateAllData();
                } else {
                    console.log("auto-detect location failed")
                }
            };
            this.getLocation(cb);
        } else if (type === OWMInputTypes.CityId) {
            this.paramType = type;
            this.paramVal = value;
            this.tempWeather = null; this.tempForecast = null;
            for (var i = 0; i < this.updateListeners.length; ++i) {
                this.updateListeners[i]({}, {});
            }
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
                        <Col md={3} />
                        <Col md={6}>
                            <InputBar inputCb={this.onInputChange}/>
                        </Col>
                        <Col md={3} />
                    </Row>
                    <Row>
                        <Col md={3} />
                        <Col md={6}>
                            <CurrentWeather
                                registerListener={this.registerListener} />
                        </Col>
                        <Col md={3} />
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
