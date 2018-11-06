import React, { Component } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Card, CardDeck, CardTitle, CardText } from 'reactstrap';
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
            <Card body>
                <CardTitle>
                    {forecast.date} <br/>
                    {forecast.weather}
                </CardTitle>
                <CardText>
                    {forecast.temperature + Symbol.DegF}<br/>
                    Humidity {forecast.humidity + Symbol.Percent}
                </CardText>
            </Card>
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
                    <CardDeck>
                        {this.drawForecast(this.state.forecastData.forecasts[0])}
                        {this.drawForecast(this.state.forecastData.forecasts[1])}
                        {this.drawForecast(this.state.forecastData.forecasts[2])}
                        {this.drawForecast(this.state.forecastData.forecasts[3])}
                        {this.drawForecast(this.state.forecastData.forecasts[4])}
                    </CardDeck>
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
