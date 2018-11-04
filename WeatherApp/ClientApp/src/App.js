import React, { Component } from 'react';
import { Col, Grid, Row, Label } from 'react-bootstrap'
import { CurrentWeather } from './components/CurrentWeather';
import { Forecast } from './components/Forecast';
import { OWMInputTypes } from './Config';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paramType: OWMInputTypes.GeoLocation,
            paramVal: "",
        };

        this.getLocation = this.getLocation.bind(this);

        this.getLocation();
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude.toFixed(2);
                const lon = position.coords.longitude.toFixed(2);
                this.setState({
                    paramType: this.state.paramType,
                    paramVal: "" + lat + "," + lon,
                })
                console.log("lat,lon=" + this.state.paramVal);
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    

    render() {
        return (
            <div>
                <Label>
                    Powered by OpenWeatherMap
                </Label>
                <Grid fluid>
                    <Row>
                        <Col md={4} />
                        <Col md={4}>
                            <CurrentWeather
                                paramType={this.state.paramType}
                                paramVal={this.state.paramVal} />
                        </Col>
                        <Col md={4} />
                    </Row>
                    <Row>
                        <Forecast
                            paramType={this.state.paramType}
                            paramVal={this.state.paramVal} />
                    </Row>
                </Grid>
            </div>
        );
    }
}
