import React, { Component } from 'react';
import { Jumbotron, Container, Row, Col, Media } from 'reactstrap'
import { Symbol, GetIconPath } from '../Config';
import './CurrentWeather.css'

export class CurrentWeather extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weatherData: {},
        };
        this.onUpdate = this.onUpdate.bind(this);

        this.props.registerListener(this.onUpdate);

        this.icon = "";
    }

    onUpdate(weather, forecasts) {
        this.setState({
            weatherData: weather
        });
    }

    render() {
        console.log("CurWeather render");
        if (this.state.weatherData &&
            this.state.weatherData.code &&
            this.state.weatherData.code === 'GOOD') {
            console.log("CurWeather is rendering")
            this.icon = GetIconPath(this.state.weatherData.weather)
            return (
                <Jumbotron>
                    <Container>
                        <Row>
                            <Col>
                                <h1 className="curWeather">
                                    {this.state.weatherData.city + ", "}
                                    {this.state.weatherData.country} <br />
                                    {this.state.weatherData.weather}
                                </h1>
                                <p className="curWeather">
                                    {this.state.weatherData.temperature + Symbol.DegF}<br />
                                    Min {this.state.weatherData.temperatureMin + Symbol.DegF} | Max {this.state.weatherData.temperatureMax + Symbol.DegF} <br />
                                    Humidity {this.state.weatherData.humidity + Symbol.Percent} </p>
                            </Col>
                            <Col>
                                <img className="curWeatherIcon"
                                    src={require(`${ this.icon }`)}
                                    alt=""
                                    width="100%"
                                    height="100%" />
                            </Col>
                        </Row>
                        
                            
                        
                    </Container>
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
                    <p> First loading may take some time :P </p>
                </Jumbotron>
            );
        }
    }
}