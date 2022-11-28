import React, {
  Component
  // useEffect,
  // useState
} from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

const mapStyles = {
  width: '100%',
  height: '80vh'
};

// const positions = {
//   const [positions, getPositions]

// };

export class MapContainer extends Component {
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
      />
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDr2sLloniItSejbFLVMShC9Kw0euajErY'
})(MapContainer);
