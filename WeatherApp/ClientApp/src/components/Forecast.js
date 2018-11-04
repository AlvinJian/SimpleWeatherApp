import React, { Component } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import { OWMInputTypes, Symbol } from '../Config';
import './Forecast.css'

export class Forecast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weatherData: {}
        };
        this.getForecast = this.getForecast.bind(this);
        this.drawRaw = this.drawForecast.bind(this);
    }

    getForecast() {
        var call = 'api/OWMReq/';
        if (this.props.paramType === OWMInputTypes.GeoLocation) {
            call += ('ForecastByGeo/' + this.props.paramVal);
        }
        else if (this.props.paramType === OWMInputTypes.CityId) {
            call += ('ForecastById/' + this.props.paramVal);
        }
        else {
            console.log("parameter type: " + this.props.paramType +
                " is not supported");
        }
        if ((this.props.paramType === OWMInputTypes.CityId && this.props.paramVal > 0) ||
            (this.props.paramType === OWMInputTypes.GeoLocation && this.props.paramVal.length > 1)) {
            fetch(call).then(response => response.json())
                .then(data => {
                    console.log(JSON.stringify(data));
                    this.setState({ weatherData: data });
                })
        }
        else {
            console.log("skip fetch");
        }
    }

    drawForecast(forecast) {
        return (
            <div>
                <h1 className="forecast">
                    {forecast.date} <br/>
                    {forecast.weather}
                </h1>
                <p className="forecast">
                    {forecast.temperature + Symbol.DegF}<br/>
                    Humidity {forecast.humidity + Symbol.Percent}
                </p>
            </div>
        );
    }

    render() {
        console.log("Forecast render");
        if (this.state.weatherData.code &&
            this.state.weatherData.code === 'GOOD') {
            console.log("Forecast is rendering")
            return (
                <Grid>
                    <Row className="show-grid">
                        <div>
                        <Col md={1}> <br/> </Col>
                        <Col md={2}>
                            {this.drawForecast(this.state.weatherData.forecasts[0])}
                        </Col>
                        <Col md={2}>
                            {this.drawForecast(this.state.weatherData.forecasts[1])}
                        </Col>
                        <Col md={2}>
                            {this.drawForecast(this.state.weatherData.forecasts[2])}
                        </Col>
                        <Col md={2}>
                            {this.drawForecast(this.state.weatherData.forecasts[3])}
                        </Col>
                        <Col md={2}>
                            {this.drawForecast(this.state.weatherData.forecasts[4])}
                        </Col>
                            <Col md={1}> <br/> </Col>
                            </div>
                    </Row>
                </Grid>
            );
        }
        else {
            this.getForecast();
            return (
                <div/>
            );
        }
    }
}