import React, { Component } from 'react';
import { CurrentWeather } from './components/CurrentWeather';
import { OWMInputTypes } from './Config';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paramType: OWMInputTypes.GeoLocation,
            paramVal: "",
        };

        this.getLocation = this.getLocation.bind(this);

        this.getLocation();
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude.toFixed(2);
                const lon = position.coords.longitude.toFixed(2);
                this.setState({
                    paramType: this.state.paramType,
                    paramVal: "" + lat + "," + lon,
                })
                console.log("lat,lon=" + this.state.paramVal);
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    

    render() {
        return (
            <div>
                <h3>Simple Weather App</h3>
                <CurrentWeather
                    paramType={this.state.paramType}
                    paramVal={this.state.paramVal} />
            </div>
        );
    }
}
