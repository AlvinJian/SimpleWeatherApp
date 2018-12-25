import React, { Component } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Card, CardDeck, CardTitle, CardText, CardImg } from 'reactstrap';
import { Symbol, GetIconPath } from '../Config';
import './Forecast.css'

export default class Forecast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            forecastData: {}
        };

        this.drawForecast = this.drawForecast.bind(this);
        this.onUpdate = this.onUpdate.bind(this);

        this.props.registerListener(this.onUpdate);
        this.icons = [];
    }

    onUpdate(weather, forecasts) {
        this.setState({
            forecastData: forecasts,
        });
    }

    drawForecast(index) {
        let forecast = this.state.forecastData.forecasts[index];
        let icon = this.icons[index];
        return (
            <Card body className="forecast_tile">
                <CardTitle>
                    {forecast.date} <br/>
                    {forecast.weather}
                </CardTitle>
                <CardText>
                    {forecast.temperature + Symbol.DegF}<br/>
                    Humidity {forecast.humidity + Symbol.Percent}
                </CardText>
                <Container>
                    <img className="forcastIcon" width="50%" src={icon} alt="" />
                </Container>
            </Card>
        );
    }

    render() {
        console.log("Forecast render");
        if (this.state.forecastData &&
            this.state.forecastData.code &&
            this.state.forecastData.code === 'GOOD') {
            console.log("Forecast is rendering");
            this.icons = this.state.forecastData.forecasts.map((f, id) => {
                return GetIconPath(f.weather);
            });
            return (
                <Container>
                    <CardDeck>
                        {this.drawForecast(0)}
                        {this.drawForecast(1)}
                        {this.drawForecast(2)}
                        {this.drawForecast(3)}
                        {this.drawForecast(4)}
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
