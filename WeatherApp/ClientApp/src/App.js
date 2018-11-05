import React, { Component } from 'react';
import { Button, Col, Grid, Row, Label, DropdownButton, MenuItem } from 'react-bootstrap'
import { CurrentWeather } from './components/CurrentWeather';
import { Forecast } from './components/Forecast';
import { OWMInputTypes } from './Config';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paramType: OWMInputTypes.GeoLocation,
            paramVal: "",
            cityList: []
        };
        this.cbList = [];

        this.getLocation = this.getLocation.bind(this);
        this.renderCityList = this.renderCityList.bind(this);
        this.registerCallback = this.registerCallback.bind(this);
        this.getLocationAndUpdate = this.getLocationAndUpdate.bind(this);
        this.onCitySelected = this.onCitySelected.bind(this);

        fetch('api/CityInfo/AllList/')
            .then(response => response.json())
            .then(data => {
                console.log(JSON.stringify(data));
                this.setState({
                    paramType: OWMInputTypes.CityId,
                    paramVal: data.list[0].id,
                    cityList: data.list
                });
            });
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude.toFixed(2);
                const lon = position.coords.longitude.toFixed(2);
                this.setState({
                    paramType: OWMInputTypes.GeoLocation,
                    paramVal: "" + lat + "," + lon,
                })
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

    registerCallback(cb) {
        this.cbList.push(cb);
    }

    getLocationAndUpdate() {
        console.log("number of current listener=" + this.cbList.length);
        for (var i = 0; i < this.cbList.length; ++i) {
            this.cbList[i](true);
        }
        this.getLocation();
    }

    onCitySelected(k, e) {
        for (var i = 0; i < this.cbList.length; ++i) {
            this.cbList[i](true);
        }
        this.setState({
            paramType: OWMInputTypes.CityId,
            paramVal: k
        });
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
                                updateManager={this.registerCallback} />
                        </Col>
                        <Col md={4} />
                    </Row>
                    <Row>
                        <Forecast
                            paramType={this.state.paramType}
                            paramVal={this.state.paramVal}
                            updateManager={this.registerCallback}/>
                    </Row>
                </Grid>
            </div>
        );
    }
}
