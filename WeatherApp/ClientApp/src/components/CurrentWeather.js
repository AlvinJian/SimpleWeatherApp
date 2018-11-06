import React, { Component } from 'react';
import { Jumbotron } from 'reactstrap'
import { Symbol } from '../Config';
import './CurrentWeather.css'

export class CurrentWeather extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weatherData: {}
        };
        this.onUpdate = this.onUpdate.bind(this);

        this.props.registerListener(this.onUpdate);
    }

    onUpdate(weather, forecasts) {
        this.setState({
            weatherData: weather,
        });
    }

    render() {
        console.log("CurWeather render");
        if (this.state.weatherData &&
            this.state.weatherData.code &&
            this.state.weatherData.code === 'GOOD') {
            console.log("CurWeather is rendering")
            return (
                <Jumbotron>
                    <h1 className="curWeather">
                        {this.state.weatherData.city+", "}
                        {this.state.weatherData.country} <br/>
                        {this.state.weatherData.weather}
                    </h1>
                    <p className="curWeather">
                        {this.state.weatherData.temperature + Symbol.DegF}<br />
                        Min {this.state.weatherData.temperatureMin + Symbol.DegF } |
                        Max {this.state.weatherData.temperatureMax + Symbol.DegF} <br />
                        Humidity {this.state.weatherData.humidity + Symbol.Percent}</p>
                </Jumbotron>
            );
        }
        else {
            const noDataStyle = {
                fontSize: 'xx-large',
                textAlign: 'center'
            };
            return (
                <Jumbotron>
                    <h1 style={noDataStyle}> Loading... </h1>
                </Jumbotron>
            );
        }
    }
}