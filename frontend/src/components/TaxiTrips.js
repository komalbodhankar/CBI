import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BasicTable from './table/table';
import { Grid } from '@mui/material';
import MapContainer from './maps/HeatMap';

function TaxiTrips () {
  const [data, setData] = useState([]);

  const getData = async () => {
    const data = await axios.get('http://127.0.0.1:5000/taxiTrips', setTimeout(4000));
    setData(data.data);
    return data;
  };
  const data2 = [
    { lat: 37.782551, lng: -122.44536800000003 },
    { lat: 37.782745, lng: -122.44458600000002 },
    { lat: 37.782842, lng: -122.44368800000001 },
    { lat: 37.782919, lng: -122.442815 },
    { lat: 37.782992, lng: -122.44211200000001 },
    { lat: 37.7831, lng: -122.441461 },
    { lat: 37.783206, lng: -122.44082900000001 },
    { lat: 37.783273, lng: -122.44032400000003 },
    { lat: 37.783316, lng: -122.440023 },
    { lat: 37.783357, lng: -122.439794 },
    { lat: 37.783371, lng: -122.43968699999999 },
    { lat: 37.783368, lng: -122.43966599999999 },
    { lat: 37.783383, lng: -122.439594 },
    { lat: 37.783508, lng: -122.439525 },
    { lat: 37.783842, lng: -122.43959100000001 },
    { lat: 37.784147, lng: -122.43966799999998 },
    { lat: 37.784206, lng: -122.439686 },
    { lat: 37.784386, lng: -122.43979000000002 },
    { lat: 37.784701, lng: -122.43990200000002 },
    { lat: 37.784965, lng: -122.43993799999998 },
    { lat: 37.78501, lng: -122.43994700000002 },
    { lat: 37.78536, lng: -122.439952 },
    { lat: 37.785715, lng: -122.44002999999998 },
    { lat: 37.786117, lng: -122.44011899999998 },
    { lat: 37.786564, lng: -122.44020899999998 },
    { lat: 37.786905, lng: -122.44027 },
    { lat: 37.786956, lng: -122.44027900000003 },
    { lat: 37.800224, lng: -122.43351999999999 }];
  useEffect(() => {
    getData();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid xs={6} spacing={2}>
        <BasicTable columns={['Trip ID', 'Trip Start Time', 'Trip End Time', 'Trip Secs', 'Trip Miles', 'Pick-up Area', 'Drop-off Area', 'Fair', 'Tips', 'Tolls', 'Extras', 'Trip Total', 'Payment Type', 'Company', 'Src Latitude', 'Src Longitude', 'Dest Latitude', 'Dest Longitude']} rows={data} />
      </Grid>
      <Grid xs={6}>
        <MapContainer center={{ lat: 37.775, lng: -122.434 }} zoom={14} positions={data2} />
      </Grid>
    </Grid>
  );
}

export default TaxiTrips;
