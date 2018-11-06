import React, { Component } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Symbol } from '../Config';
import './Forecast.css'

export class Forecast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            forecastData: {}
        };

        this.drawForecast = this.drawForecast.bind(this);
        this.onUpdate = this.onUpdate.bind(this);

        this.props.registerListener(this.onUpdate);
    }

    onUpdate(weather, forecasts) {
        this.setState({
            forecastData: forecasts,
        });
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

    render() {
        console.log("Forecast render");
        if (this.state.forecastData &&
            this.state.forecastData.code &&
            this.state.forecastData.code === 'GOOD') {
            console.log("Forecast is rendering")
            return (
                <Container>
                    <Row>
                        
                        <Col md={1}> <br/> </Col>
                        <Col md={2}>
                            {this.drawForecast(this.state.forecastData.forecasts[0])}
                        </Col>
                        <Col md={2}>
                            {this.drawForecast(this.state.forecastData.forecasts[1])}
                        </Col>
                        <Col md={2}>
                            {this.drawForecast(this.state.forecastData.forecasts[2])}
                        </Col>
                        <Col md={2}>
                            {this.drawForecast(this.state.forecastData.forecasts[3])}
                        </Col>
                        <Col md={2}>
                            {this.drawForecast(this.state.forecastData.forecasts[4])}
                        </Col>
                            <Col md={1}> <br/> </Col>
                        
                    </Row>
                </Container>
            );
        }
        else {
            return (
                <div/>
            );
        }
    }
}
