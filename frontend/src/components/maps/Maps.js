import React, {
  Component
  // useEffect,
  // useState
} from 'react';
import { Map, Marker, GoogleApiWrapper, InfoWindow } from 'google-maps-react';
// import axios from 'axios';

const mapStyles = {
  width: '100%',
  height: '80vh'
};

// const positions = async () => {
//   const [setPos] = useState([]);
//   const data = await axios.get('http://127.0.0.1:5000/getZip', setTimeout(4000), { crossOriginIsolated: true });
//   setPos(data.data);
//   console.log(data);

//   useEffect(() => {
//     positions();
//   }, []);
// };

export class MapContainer extends Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {}
  };

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  render () {
    return (
      <Map
        google={this.props.google}
        zoom={10}
        containerStyle={{ height: '100%', width: '40%' }}
        style={mapStyles}
        initialCenter={
          {
            lat: 41.881832,
            lng: -87.623177
          }
        }
      >
        <Marker
          onClick={this.onMarkerClick}
          name={'Chicago'}
        />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          <div>
            <h4>{this.state.selectedPlace.name}</h4>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDr2sLloniItSejbFLVMShC9Kw0euajErY'
})(MapContainer);
