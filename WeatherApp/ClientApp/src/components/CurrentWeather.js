import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap'
import { OWMInputTypes, Symbol } from '../Config';
import './CurrentWeather.css'

export class CurrentWeather extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weatherData: {}
        };
        this.getCurrentWeather = this.getCurrentWeather.bind(this);
    }

    getCurrentWeather() {
        var call = 'api/OWMReq/';
        if (this.props.paramType === OWMInputTypes.GeoLocation) {
            call += ('WeatherByGeo/' + this.props.paramVal);
        }
        else if (this.props.paramType === OWMInputTypes.CityId) {
            call += ('WeatherById/' + this.props.paramVal);
        }
        else {
            console.log("parameter type: " + this.props.paramType +
                " is not supported");
        }
        console.log("call: " + call);
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

    render() {
        console.log("CurWeather render");
        if (this.state.weatherData.code &&
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
            this.getCurrentWeather();
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