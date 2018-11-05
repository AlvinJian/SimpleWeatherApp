import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap'
import { Symbol } from '../Config';
import './CurrentWeather.css'

export class CurrentWeather extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("CurWeather render");
        if (this.props.weatherData &&
            this.props.weatherData.code &&
            this.props.weatherData.code === 'GOOD') {
            console.log("CurWeather is rendering")
            return (
                <Jumbotron>
                    <h1 className="curWeather">
                        {this.props.weatherData.city+", "}
                        {this.props.weatherData.country} <br/>
                        {this.props.weatherData.weather}
                    </h1>
                    <p className="curWeather">
                        {this.props.weatherData.temperature + Symbol.DegF}<br />
                        Min {this.props.weatherData.temperatureMin + Symbol.DegF } |
                        Max {this.props.weatherData.temperatureMax + Symbol.DegF} <br />
                        Humidity {this.props.weatherData.humidity + Symbol.Percent}</p>
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
                    <h1 style={noDataStyle}> No data yet :( </h1>
                </Jumbotron>
            );
        }
    }
}