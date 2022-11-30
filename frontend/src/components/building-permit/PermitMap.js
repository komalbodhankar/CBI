import React, { useEffect, useState } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import axios from 'axios';
import { Box, Card, CardContent, Typography } from '@mui/material';
// import greenpin from '../../images/green.svg';

const PermitMapContainer = ({ google }) => {
  const [selected, setSelected] = useState({});
  const [markers, setMarkers] = useState([]);
  const [showInfo, setShowInfo] = useState(false);

  const getMarkersPoverty = async () => {
    const markers = await axios.get('http://127.0.0.1:5000/permitCountChart', setTimeout(4000), { crossOriginIsolated: true });
    return markers.data;
  };

  useEffect(() => {
    const getpovertydata = async () => {
      const markersPoverty = await getMarkersPoverty();
      setMarkers(markersPoverty);
      console.log(markersPoverty);
    };
    getpovertydata();
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        height: 'calc(92vh - 20px)'
      }}
    >
      <Map google={google} zoom={10} initialCenter={{ lat: 41.881832, lng: -87.623177 }}>
        {markers.map((marker, index) => {
          return (
            <Marker onClick={() => {
              setSelected(marker);
              setShowInfo(true);
            }} key={index} position={{ lat: marker.Latitude, lng: marker.Longitude }} />
          );
        })}
        <InfoWindow
          position={{ lat: selected.Latitude, lng: selected.Longitude }}
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
                  {'Zip Code: ' + selected.ZipCode}
                </Typography>
                <Typography>
                  {'Per Capita Income: ' + selected.PerCapita}
                </Typography>
                <Typography>
                  {'PermitType : ' + selected.PermitType}
                </Typography>
                <Typography color="text.secondary">
                  {'Building Permits Count:' + selected.Count}
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
  apiKey: 'AIzaSyDr2sLloniItSejbFLVMShC9Kw0euajErY'
})(PermitMapContainer);
