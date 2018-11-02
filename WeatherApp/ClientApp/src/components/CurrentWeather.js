import React, { Component } from 'react';
import { OWMInputTypes } from '../Config';

export class CurrentWeather extends Component {
    constructor(props) {
        super(props);
    }



    render() {
        if (this.props.weatherData.code &&
            this.props.weatherData.code === 'GOOD') {
            return (
                <div>
                    <h1>
                        {this.props.weatherData.city},
                        {this.props.weatherData.country}
                    </h1>
                    <h2> {this.props.weatherData.weather} </h2>
                    <h2> {this.props.weatherData.temperature} F</h2>
                    <h2> {this.props.weatherData.humidity} % </h2>
                </div>
            );
        }
        else {
            return (
                <div>
                    <h2> No data yet :( </h2>
                </div>
            );
        }
    }
}