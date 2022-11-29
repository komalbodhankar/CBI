import React, { useEffect, useState } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import axios from 'axios';
// import greenpin from '../../images/green.svg';

const MapContainer = ({ google }) => {
  const [markersPoverty, setMarkersPoverty] = useState([]);
  const [markersUnemp, setMarkersUnemp] = useState([]);

  const getMarkersPoverty = async () => {
    const markersPoverty = await axios.get('http://127.0.0.1:5000/getPoverty', setTimeout(4000));
    return markersPoverty.data;
  };

  useEffect(() => {
    const getpovertydata = async () => {
      const markersPoverty = await getMarkersPoverty();
      setMarkersPoverty(markersPoverty);
      console.log(markersPoverty);
    };
    getpovertydata();
  }, []);

  const getMarkersUnemp = async () => {
    const markersUnemp = await axios.get('http://127.0.0.1:5000/getUnemp', setTimeout(4000));
    return markersUnemp.data;
  };

  useEffect(() => {
    const getunempdata = async () => {
      const markersUnemp = await getMarkersUnemp();
      setMarkersUnemp(markersUnemp);
      console.log(markersUnemp);
    };
    getunempdata();
  }, []);

  //   const [data, setPoverty] = useState([]);
  //   const [unemp, setUnemp] = useState([]);

  //   const getData = async () => {
  //     const data = await axios.get('http://127.0.0.1:5000/unEmployment', setTimeout(4000), { crossOriginIsolated: true });
  //     setPoverty(data.data[0]);
  //     console.log(data);
  //   };

  //   const getUnemp = async () => {
  //     const unemp = await axios.get('http://127.0.0.1:5000/unEmployment', setTimeout(4000), { crossOriginIsolated: true });
  //     setUnemp(unemp.data[1]);
  //     console.log(unemp);
  //   };

  //   useEffect(() => {
  //     const getAllData = async () => {
  //       await getData();
  //     //   await getUnemp();
  //     };
  //     getAllData();
  //   }, []);

  return (
    <div
      style={{
        position: 'relative',
        height: 'calc(100vh - 20px)'
      }}
    >
      <Map google={google} zoom={10} initialCenter={{ lat: 41.881832, lng: -87.623177 }}>
        {markersPoverty.map((markerPoverty, index) => {
          return (
            <Marker icon={{ scaledSize: new google.maps.Size(32, 32) }} key={index} position={{ lat: markerPoverty.lat, lng: markerPoverty.lng }} />
          );
        })}
        {markersUnemp.map((markersUnemp, index) => {
          return (
            <Marker icon={{ scaledSize: new google.maps.Size(32, 32) }} key={index} position={{ lat: markersUnemp.lat, lng: markersUnemp.lng }}/>
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
