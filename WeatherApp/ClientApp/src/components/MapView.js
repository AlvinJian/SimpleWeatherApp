import React, { Component } from 'react';

export default class MapView extends Component {
    constructor(props) {
        super(props);
        this.setMarker = this.setMarker.bind(this);
        this.onScriptLoad = this.onScriptLoad.bind(this)

        this.apikey = "";
        this.marker = null;
        this.pending = null;
        this.doSetMarker = null;
        this.map = null;
        this.props.setMapView(this);
    }

    setMarker(lati, lon) {
        const myLatLng = { lat: lati, lng: lon };
        if (this.marker != null) {
            this.marker.setMap(null);
        }

        if (this.doSetMarker != null) {
            if (this.marker != null) {
                this.marker.setMap(null);
            }
            this.map.setCenter(myLatLng);
            this.marker = this.doSetMarker(myLatLng);
        } else {
            this.pending = myLatLng;
        }
    }

    onScriptLoad() {
        this.map = new window.google.maps.Map(
            document.getElementById(this.props.id),
            this.props.options);
        this.doSetMarker = (latln) => {
            const marker = new window.google.maps.Marker({
                position: latln,
                map: this.map,
                title: 'Current City'
            });
            return marker;
        }
        if (this.pending != null) {
            this.map.setCenter(this.pending);
            this.marker = this.doSetMarker(this.pending);
            this.pending = null;
        }
    }

    componentDidMount() {
        if (!window.google) {
            // firstly, try to get api key from backend
            fetch("api/key/gmapjs").then((respone) => {
                respone.text().then((text) => {
                    // secondly, load google map script
                    // console.log(text);
                    this.apikey = text;
                    var s = document.createElement('script');
                    s.type = 'text/javascript';
                    s.src = `https://maps.google.com/maps/api/js?key=${this.apikey}`;
                    var x = document.getElementsByTagName('script')[0];
                    x.parentNode.insertBefore(s, x);
                    // Below is important. 
                    //We cannot access google.maps until it's finished loading
                    s.addEventListener('load', e => {
                        this.onScriptLoad()
                    })
                })
            });
        } else {
            this.onScriptLoad()
        }
    }

    render() {
        /**
         * TODO map will disappear when window is in mobile mode
         * */
        return (
            <div style={{ width: '100%', height: '92%' }} id={this.props.id} />
        );
    }
}