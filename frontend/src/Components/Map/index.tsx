import React, { Component } from 'react';
import {GoogleMap, Marker} from 'react-google-maps';

class Map extends Component {

    handleMapClick(){
        console.log('clicou');
    }

    render() {
        return (
            <GoogleMap 
            defaultZoom={15} 
            defaultCenter={{ lat: -21.8511208, lng: -47.4934614 }} 
            onClick={this.handleMapClick}
            >
                <Marker
                position={{ lat: -21.8511208, lng: -47.4934614 }}
                onClick={this.handleMapClick}
                ></Marker>
            </GoogleMap>
        );
    }
}

export default Map;