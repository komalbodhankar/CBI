import React, { useEffect, useState } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import axios from 'axios';
import { Box, Card, CardContent, Typography } from '@mui/material';
// import greenpin from '../../images/green.svg';

const MapContainer = ({ google }) => {
  const [selected, setSelected] = useState({});
  const [markersPoverty, setMarkersPoverty] = useState([]);
  const [markersUnemp, setMarkersUnemp] = useState([]);
  const [showInfo, setShowInfo] = useState(false);

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

  return (
    <div
      style={{
        position: 'relative',
        height: 'calc(75vh - 20px)'
      }}
    >
      <Map google={google} zoom={10} initialCenter={{ lat: 41.881832, lng: -87.623177 }}>
        {markersPoverty.map((markerPoverty, index) => {
          return (
            <Marker onClick={() => {
              setSelected(markerPoverty);
              setShowInfo(true);
            }} key={index} position={{ lat: markerPoverty.lat, lng: markerPoverty.lng }} />
          );
        })}
        {markersUnemp.map((markersUnemp, index) => {
          return (
            <Marker onClick={() => {
              setSelected(markersUnemp);
              setShowInfo(true);
            }} icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png', scaledSize: new google.maps.Size(32, 32) }} key={index} position={{ lat: markersUnemp.lat, lng: markersUnemp.lng }}/>
          );
        })}
        <InfoWindow
          position={{ lat: selected.lat, lng: selected.lng }}
          clickable={true}
          visible={showInfo}
          onCloseClick={() => {
            setSelected({});
            setShowInfo(false);
          }} >
          <Box sx={{ minWidth: 275 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" component="div">
                  {'Area Code: ' + selected.areaCode}
                </Typography>
                <Typography>
                  {'Area Name: ' + selected.areaName}
                </Typography>
                <Typography>
                  {'Building Permit Waiver : ' + selected.totalWaived}
                </Typography>
                <Typography color="text.secondary">
                  {'UnEmployment/Poverty Rate in (%):' + (selected.unempRate ? selected.unempRate : selected.belowPoverty)}
                </Typography>
              </CardContent>

            </Card>
          </Box>
        </InfoWindow>
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBucdGUOMJfHSY03kHfO4RzmoLpIXVBg5Y'
})(MapContainer);
