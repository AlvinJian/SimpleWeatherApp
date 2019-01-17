import React, { Component } from 'react';

export default class MapView extends Component {
    constructor(props) {
        super(props);
        this.setMarker = this.setMarker.bind(this);
        this.onScriptLoad = this.onScriptLoad.bind(this)

        //this.props.setMapView(this);
    }

    setMarker(lat, lon) {
        // TODO
    }

    onScriptLoad() {
        const map = new window.google.maps.Map(
            document.getElementById(this.props.id),
            this.props.options);
        //this.props.onMapLoad(map)
    }

    componentDidMount() {
        if (!window.google) {
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = `https://maps.google.com/maps/api/js?key=AIzaSyDhfsJRh-d370hbBYZItcJVgB5oWFgmbxg`;
            var x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);
            // Below is important. 
            //We cannot access google.maps until it's finished loading
            s.addEventListener('load', e => {
                this.onScriptLoad()
            })
        } else {
            this.onScriptLoad()
        }
    }

    render() {
        return (
            <div style={{ width: '100%', height: '92%' }} id={this.props.id} />
        );
    }
}