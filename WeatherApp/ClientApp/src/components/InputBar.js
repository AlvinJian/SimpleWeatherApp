import React, { Component } from 'react';
import { Input, InputGroup } from 'reactstrap';
import { Button, ButtonGroup } from 'reactstrap';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { OWMInputTypes } from '../Config';
import './InputBar.css'

export default class InputBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cityList: [],
            isDropDownOpen: false
        }
        this.paramType = OWMInputTypes.CityId;
        this.paramVal = -1;
        this.searchHandle = null;
        this.searchTimeOutVal = 1000;
        this.searchKeyword = "";

        // bind functions
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.searchCity = this.searchCity.bind(this);
        this.renderCityList = this.renderCityList.bind(this);
        this.onCitySelected = this.onCitySelected.bind(this);
        this.onAutoButtonClicked = this.onAutoButtonClicked.bind(this);

        // initialization
        this.isLoading = true;
        fetch('api/CityInfo/ShortList/')
            .then(response => response.json())
            .then(data => {
                // console.log(JSON.stringify(data));
                this.paramType = OWMInputTypes.CityId;
                this.paramVal = data.list[0].id;
                this.setState({
                    cityList: data.list,
                });
                this.shortCity = data.list;
                this.isLoading = false;
                this.props.inputCb(this.paramType, this.paramVal);
            });
    }

    toggleDropdown() {
        this.setState({
            isDropDownOpen: !this.state.isDropDownOpen
        });
    }

    searchCity(evt) {
        console.log("keyword: " + evt.currentTarget.value);
        this.searchKeyword = evt.currentTarget.value.trim();
        if (this.searchHandle != null) {
            clearTimeout(this.searchHandle);
        }
        if (this.searchKeyword.length > 3) {
            this.searchHandle = setTimeout(() => {
                this.isLoading = true;
                this.searchHandle = null;
                this.setState({ cityList: [] }, () => {
                    fetch('api/CityInfo/SearchCity/' + this.searchKeyword)
                        .then(response => response.json())
                        .then(data => {
                            this.isLoading = false;
                            this.setState({
                                cityList: data.list,
                            });
                        });
                });
            }, this.searchTimeOutVal);
        } else if (this.searchKeyword.length === 0) {
            this.isLoading = false;
            if (this.shortCity) {
                this.setState(
                    { cityList: this.shortCity }
                );
            }
        } else {
            this.isLoading = false;
            this.setState(
                { cityList: [] }
            );
        }
    }

    renderCityList() {
        let custom = { margin: "5px" };
        let _showList;
        let emptyMsg = "";
        if (!this.isLoading && this.state.cityList.length > 0) {
            _showList = () => {
                return this.state.cityList.map(
                    (city, i) => {
                        return (<DropdownItem
                            id={city.id} key={city.id} onClick={this.onCitySelected}>
                            {city.name}, {city.country},
                            ({city.lat.toFixed(2)},{city.lon.toFixed(2)})
                        </DropdownItem>);
                    }
                );
            }
        } else if (this.isLoading) {
            emptyMsg += "Loading...";
            _showList = () => {
                return <DropdownItem key={0}>{emptyMsg}</DropdownItem>;
            }
        } else {
            if (this.searchKeyword.length > 3) {
                emptyMsg += "No City found..."
            } else {
                emptyMsg += "Type first 4 or more char to Search";
            }
            _showList = () => {
                return <DropdownItem key={0}>{emptyMsg}</DropdownItem>;
            }
        }
        return (
            <div>
                <InputGroup>
                    <Input
                        style={custom}
                        type="text"
                        placeholder="Type first 4 or more char to Search"
                        onChange={this.searchCity} />
                </InputGroup>
                {_showList()}
            </div>
        );
    }

    onAutoButtonClicked() {
        this.paramType = OWMInputTypes.GeoLocation;
        this.paramVal = "";
        this.props.inputCb(this.paramType, this.paramVal);
    }

    onCitySelected(evt) {
        this.paramType = OWMInputTypes.CityId;
        this.paramVal = evt.currentTarget.id;
        this.props.inputCb(this.paramType, this.paramVal);
    }

    render() {
        return (
            <div className="inputBar">
                <ButtonGroup>
                    <ButtonDropdown
                        isOpen={this.state.isDropDownOpen}
                        toggle={this.toggleDropdown}>
                        <DropdownToggle
                            style={{ backgroundColor: "yellow", color: "black" }}
                            caret> Search and Select a City </DropdownToggle>
                        <DropdownMenu className="dropdownMenu">
                            {this.renderCityList()}
                        </DropdownMenu>
                    </ButtonDropdown>
                    <Button
                        style={{ backgroundColor: "darkcyan" }}
                        onClick={this.onAutoButtonClicked}>
                        Auto-detect</Button>
                </ButtonGroup>
            </div>
        );
    }
}
