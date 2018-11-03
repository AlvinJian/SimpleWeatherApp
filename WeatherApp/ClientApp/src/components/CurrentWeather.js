import React, { Component } from 'react';
import { OWMInputTypes } from '../Config';

export class CurrentWeather extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weatherData: {}
        };
        this.getCurrentWeather = this.getCurrentWeather.bind(this);

        this.getCurrentWeather();
    }

    getCurrentWeather() {
        var call = 'api/OWMReq/';
        if (this.props.paramType === OWMInputTypes.GeoLocation) {
            call += ('WeatherByGeo/' + this.props.paramVal);
        }
        else {
            console.log("parameter type: " + this.props.paramType +
                " is not supported");
        }
        console.log("call: " + call);
        if (this.props.paramVal.length > 1) {
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

    render() {
        console.log("CurWeather render");
        if (this.state.weatherData.code &&
            this.state.weatherData.code === 'GOOD') {
            console.log("CurWeather is rendering")
            return (
                <div>
                    <h1>
                        {this.state.weatherData.city},
                        {this.state.weatherData.country}
                    </h1>
                    <h2> {this.state.weatherData.weather} </h2>
                    <h2> {this.state.weatherData.temperature} F</h2>
                    <h2> {this.state.weatherData.temperatureMax} F</h2>
                    <h2> {this.state.weatherData.temperatureMin} F</h2>
                    <h2> {this.state.weatherData.humidity} % </h2>
                </div>
            );
        }
        else {
            this.getCurrentWeather();
            return (
                <div>
                    <h2> No data yet :( </h2>
                </div>
            );
        }
    }
}