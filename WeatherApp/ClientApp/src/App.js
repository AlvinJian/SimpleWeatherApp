import React, { Component } from 'react';
import { CurrentWeather } from './components/CurrentWeather';
import { OWMInputTypes } from './Config';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paramType: OWMInputTypes.GeoLocation,
            param: ""
        };

        this.getLocation = this.getLocation.bind(this);
        this.getLocation();
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude.toFixed(2);
                const lon = position.coords.longitude.toFixed(2);
                    this.setState({ param: "" + lat + "," + lon })
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    render() {
        return (
            <div>
                <h1>Simple Weather App</h1>
                <CurrentWeather
                    type={this.state.paramType}
                    param={this.state.param} />
            </div>
        );
    }
}
