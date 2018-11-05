import React, { Component } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import { Symbol } from '../Config';
import './Forecast.css'

export class Forecast extends Component {
    constructor(props) {
        super(props);
        this.drawForecast = this.drawForecast.bind(this);
    }

    drawForecast(forecast) {
        return (
            <div className="forecast_tile">
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

    updateListen(update) {
        this.shouldUpdateForecast = update;
    }

    render() {
        console.log("Forecast render");
        if (this.props.forecastData &&
            this.props.forecastData.code &&
            this.props.forecastData.code === 'GOOD') {
            console.log("Forecast is rendering")
            return (
                <Grid>
                    <Row className="show-grid">
                        <div>
                        <Col md={1}> <br/> </Col>
                        <Col md={2}>
                            {this.drawForecast(this.props.forecastData.forecasts[0])}
                        </Col>
                        <Col md={2}>
                            {this.drawForecast(this.props.forecastData.forecasts[1])}
                        </Col>
                        <Col md={2}>
                            {this.drawForecast(this.props.forecastData.forecasts[2])}
                        </Col>
                        <Col md={2}>
                            {this.drawForecast(this.props.forecastData.forecasts[3])}
                        </Col>
                        <Col md={2}>
                            {this.drawForecast(this.props.forecastData.forecasts[4])}
                        </Col>
                            <Col md={1}> <br/> </Col>
                            </div>
                    </Row>
                </Grid>
            );
        }
        else {
            return (
                <div/>
            );
        }
    }
}