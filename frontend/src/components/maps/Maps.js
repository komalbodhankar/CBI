import React, { useEffect, useState } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import axios from 'axios';

const MapContainer = ({ google }) => {
  const [markers, setMarkers] = useState([]);

  const getMarkers = async () => {
    const markers = await axios.get('http://127.0.0.1:5000/getZip', setTimeout(4000), { crossOriginIsolated: true });
    return markers.data;
  };

  useEffect(() => {
    const getallData = async () => {
      const markers = await getMarkers();
      setMarkers(markers);
    };
    getallData();
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        height: 'calc(90vh - 20px)'
      }}
    >
      <Map google={google} zoom={11} initialCenter={{ lat: 41.881832, lng: -87.623177 }}>
        {markers.map((marker, index) => {
          return (
            <Marker icon={{ url: marker.img, scaledSize: new google.maps.Size(32, 32) }} key={index} position={{ lat: marker.lat, lng: marker.lng }} />
          );
        })}
        {/* <InfoWindow
          position={{ lat: selected.latitude, lng: selected.longitude }}
          clickable={true}
          visible={showInfo}
          onCloseClick={() => onSelectClose()} >
        </InfoWindow> */}
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDr2sLloniItSejbFLVMShC9Kw0euajErY'
})(MapContainer);
