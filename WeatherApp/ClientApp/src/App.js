import React, { Component } from 'react';
import { Badge } from 'reactstrap';
import { Button, ButtonGroup } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { ButtonDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { CurrentWeather } from './components/CurrentWeather';
import { Forecast } from './components/Forecast';
import { OWMInputTypes } from './Config';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cityList: [],
            isDropDownOpen: false
        };
        this.paramType = OWMInputTypes.CityId;
        this.paramVal = -1;

        this.updateListeners = [];

        this.getLocation = this.getLocation.bind(this);
        this.renderCityList = this.renderCityList.bind(this);
        this.getLocationAndUpdate = this.getLocationAndUpdate.bind(this);
        this.onCitySelected = this.onCitySelected.bind(this);

        this.getCurrentWeather = this.getCurrentWeather.bind(this);
        this.getForecast = this.getForecast.bind(this);
        this.updateAllData = this.updateAllData.bind(this);
        this.refreshIfNeed = this.refreshIfNeed.bind(this);
        this.registerListener = this.registerListener.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);

        this.tempWeather = null;
        this.tempForecast = null;

        fetch('api/CityInfo/ShortList/')
            .then(response => response.json())
            .then(data => {
                // console.log(JSON.stringify(data));
                this.paramType = OWMInputTypes.CityId;
                this.paramVal = data.list[0].id;
                this.setState({
                    cityList: data.list,
                }, this.updateAllData);
            });
    }

    toggleDropdown() {
        this.setState({
            isDropDownOpen: !this.state.isDropDownOpen
        });
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

    renderCityList() {
        if (this.state.cityList.length < 1) {
            return (<DropdownItem key={0}>Loading...</DropdownItem>);
        }
        else {
            return (this.state.cityList.map(
                (city, i) => <DropdownItem id={city.id} key={city.id} onClick={this.onCitySelected}>{city.name}</DropdownItem>));
        }
    }

    getLocationAndUpdate() {
        this.tempWeather = null; this.tempForecast = null;
        for (var i = 0; i < this.updateListeners.length; ++i) {
            this.updateListeners[i]({}, {});
        }
        var cb = (success) => {
            if (success) {
                this.updateAllData();
            }
            else {
                this.paramType = OWMInputTypes.CityId;
                this.paramVal = this.state.cityList[0].id;
                this.updateAllData();
            }
        };
        this.getLocation(cb);
    }

    onCitySelected(evt) {
        this.tempWeather = null; this.tempForecast = null;
        for (var i = 0; i < this.updateListeners.length; ++i) {
            this.updateListeners[i]({}, {});
        }
        this.paramType = OWMInputTypes.CityId;
        this.paramVal = evt.currentTarget.id;
        this.updateAllData();
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
                            <ButtonGroup className="inputBar">
                                <ButtonDropdown
                                    isOpen={this.state.isDropDownOpen}
                                    toggle={this.toggleDropdown}>
                                    <DropdownToggle
                                        style={{ backgroundColor: "yellow", color: "black" }}
                                        caret> Select a City </DropdownToggle>
                                    <DropdownMenu>
                                        {this.renderCityList()}
                                    </DropdownMenu>
                                </ButtonDropdown >
                                <Button
                                    style={{ backgroundColor: "darkcyan" }}
                                    onClick={this.getLocationAndUpdate}>
                                    Auto-detect</Button>
                            </ButtonGroup>
                        </Col>
                        <Col md={3} />
                    </Row>
                    <Row>
                        <Col md={3} />
                        <Col md={6}>
                            <CurrentWeather
                                paramType={this.paramType}
                                paramVal={this.paramVal}
                                registerListener={this.registerListener} />
                        </Col>
                        <Col md={3} />
                    </Row>
                    <Forecast className="forecast_deck"
                        paramType={this.paramType}
                        paramVal={this.paramVal}
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
