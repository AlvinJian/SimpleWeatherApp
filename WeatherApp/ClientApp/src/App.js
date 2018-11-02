import React, { Component } from 'react';
import { CurrentWeather } from './components/CurrentWeather';
import { OWMInputTypes } from './Config';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paramType: OWMInputTypes.GeoLocation,
            paramVal: ""
        };

        this.getLocation = this.getLocation.bind(this);
        this.getCurrentWeather = this.getCurrentWeather.bind(this);

        this.getLocation();
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude.toFixed(2);
                const lon = position.coords.longitude.toFixed(2);
                this.setState({ paramVal: "" + lat + "," + lon })
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    getCurrentWeather() {
        var call = 'api/OWMReq/';
        if (this.state.paramType === OWMInputTypes.GeoLocation) {
            call += ('WeatherByGeo/' + this.state.paramVal);
        }
        else {
            console.log("parameter type: " + this.state.paramType +
                " is not supported");
        }
        console.log("call: " + call);
        if (call.length > 0) {
            fetch(call).then(response => response.json())
                .then(data => { console.log(JSON.stringify(data)); })
        }
    }

    render() {
        if (this.state.paramVal.length > 1) {
            this.getCurrentWeather();
        }

        return (
            <div>
                <h1>Simple Weather App</h1>
                <CurrentWeather
                    paramType={this.state.paramType}
                    paramVal={this.state.paramVal} />
            </div>
        );
    }
}
