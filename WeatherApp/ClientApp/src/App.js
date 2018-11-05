import React, { Component } from 'react';
import { Button, Col, Grid, Row, Label, DropdownButton, MenuItem } from 'react-bootstrap'
import { CurrentWeather } from './components/CurrentWeather';
import { Forecast } from './components/Forecast';
import { OWMInputTypes } from './Config';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paramType: OWMInputTypes.CityId,
            paramVal: "",
            cityList: [],
            weatherData: {},
            forecastData: {}
        };

        this.getLocation = this.getLocation.bind(this);
        this.renderCityList = this.renderCityList.bind(this);
        this.getLocationAndUpdate = this.getLocationAndUpdate.bind(this);
        this.onCitySelected = this.onCitySelected.bind(this);

        this.getCurrentWeather = this.getCurrentWeather.bind(this);
        this.getForecast = this.getForecast.bind(this);
        this.updateAllData = this.updateAllData.bind(this);
        this.refreshIfNeed = this.refreshIfNeed.bind(this);

        this.tempWeather = null;
        this.tempForecast = null;

        fetch('api/CityInfo/AllList/')
            .then(response => response.json())
            .then(data => {
                console.log(JSON.stringify(data));
                this.setState({
                    paramType: OWMInputTypes.CityId,
                    paramVal: data.list[0].id,
                    cityList: data.list,
                    forecastData: {},
                    weatherData: {}
                }, this.updateAllData);
            });
    }

    getLocation(cb) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude.toFixed(2);
                const lon = position.coords.longitude.toFixed(2);
                this.setState({
                    paramType: OWMInputTypes.GeoLocation,
                    paramVal: "" + lat + "," + lon,
                    weatherData: {},
                    forecastData: {}
                }, cb)
                console.log("lat,lon=" + this.state.paramVal);
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    renderCityList() {
        if (this.state.cityList.length < 1) {
            return (<MenuItem eventKey="0">Nothing</MenuItem>);
        }
        else {
            return (this.state.cityList.map(
                (city) => <MenuItem eventKey={city.id} key={city.id} onSelect={this.onCitySelected} > { city.name }</MenuItem >));
        }
    }

    getLocationAndUpdate() {
        var cb = () => {
            this.getLocation(this.updateAllData);
        };

        this.setState({
            paramType: OWMInputTypes.GeoLocation,
            paramVal: "",
            weatherData: {},
            forecastData: {},
        }, cb);
    }

    onCitySelected(k, e) {
        this.setState({
            paramType: OWMInputTypes.CityId,
            paramVal: k,
            weatherData: {},
            forecastData: {}
        }, this.updateAllData);
    }

    render() {
        return (
            <div>
                <Label>
                    Powered by OpenWeatherMap
                </Label>

                <Row>
                    <Col md={4} />
                    <Col md={4}>
                        <DropdownButton
                            title="Select a City"
                            id="city-list">
                            {this.renderCityList()}
                        </DropdownButton>
                        {'   '}or{'   '}
                        <Button onClick={this.getLocationAndUpdate}>
                            Auto-detect
                        </Button>
                    </Col>
                    <Col md={4} />
                </Row>

                <Grid fluid>
                    <Row>
                        <Col md={4} />
                        <Col md={4}>
                            <CurrentWeather
                                paramType={this.state.paramType}
                                paramVal={this.state.paramVal}
                                weatherData={this.state.weatherData} />
                        </Col>
                        <Col md={4} />
                    </Row>
                    <Row>
                        <Forecast
                            paramType={this.state.paramType}
                            paramVal={this.state.paramVal}
                            forecastData={this.state.forecastData} />
                    </Row>
                </Grid>
            </div>
        );
    }
    

    getForecast() {
        var call = 'api/OWMReq/';
        if (this.state.paramType === OWMInputTypes.GeoLocation) {
            call += ('ForecastByGeo/' + this.state.paramVal);
        }
        else if (this.state.paramType === OWMInputTypes.CityId) {
            call += ('ForecastById/' + this.state.paramVal);
        }
        else {
            console.log("parameter type: " + this.state.paramType +
                " is not supported");
        }
        if ((this.state.paramType === OWMInputTypes.CityId && this.state.paramVal > 0) ||
            (this.state.paramType === OWMInputTypes.GeoLocation && this.state.paramVal.length > 1)) {
            fetch(call).then(response => response.json())
                .then(data => {
                    console.log(JSON.stringify(data));
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
        if (this.state.paramType === OWMInputTypes.GeoLocation) {
            call += ('WeatherByGeo/' + this.state.paramVal);
        }
        else if (this.state.paramType === OWMInputTypes.CityId) {
            call += ('WeatherById/' + this.state.paramVal);
        }
        else {
            console.log("parameter type: " + this.state.paramType +
                " is not supported");
        }
        console.log("call: " + call);
        if ((this.state.paramType === OWMInputTypes.CityId && this.state.paramVal > 0) ||
            (this.state.paramType === OWMInputTypes.GeoLocation && this.state.paramVal.length > 1)) {
            fetch(call).then(response => response.json())
                .then(data => {
                    console.log(JSON.stringify(data));
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
            this.setState({
                weatherData: this.tempWeather,
                forecastData: this.tempForecast
            }, () => { this.tempWeather = null; this.tempForecast = null; });
        }
    }
}
