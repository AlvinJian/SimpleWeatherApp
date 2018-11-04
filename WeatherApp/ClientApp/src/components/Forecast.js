import React, { Component } from 'react';
import { OWMInputTypes } from '../Config';

export class Forecast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weatherData: {}
        };
        this.getForecast = this.getForecast.bind(this);
    }

    getForecast() {
        var call = 'api/OWMReq/';
        if (this.props.paramType === OWMInputTypes.GeoLocation) {
            call += ('ForecastByGeo/' + this.props.paramVal);
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
        console.log("Forecast render");
        if (this.state.weatherData.code &&
            this.state.weatherData.code === 'GOOD') {
            console.log("Forecast is rendering")
            return (
                <div>
                    <h2> {this.state.weatherData.forecasts.length} days forecasts </h2>
                </div>
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