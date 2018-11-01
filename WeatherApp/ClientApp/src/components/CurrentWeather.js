import React, { Component } from 'react';
import { OWMInputTypes } from '../Config';

export class CurrentWeather extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props);
        if (this.props.paramType.length > 0) {
            var call = 'api/OWMReq/';
            if (this.props.paramType === OWMInputTypes.GeoLocation) {
                call += ('WeatherByGeo/' + this.props.paramVal);
            }
            else {
                console.log("parameter type: " + this.props.paramType +
                    " is not supported");
            }
            console.log("call: "+call);
            if (call.length > 0) {
                fetch(call).then(response => response.json())
                    .then(data => { console.log(JSON.stringify(data)); })
            }
        }
        return (
            <div/>);
    }
}