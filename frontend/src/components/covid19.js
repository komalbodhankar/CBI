import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BasicTable from './table/table';
import { Grid } from '@mui/material';
import MapContainer from './maps/HeatMap';

function Covid19 () {
  const [data, setData] = useState([]);
  const [heatMapData, setheatMapData] = useState([]);

  const getData = async () => {
    const data = await axios.get('http://127.0.0.1:5000/covid19', setTimeout(4000));
    const temp = [];
    for (let i = 0; i < data.data.length; i++) {
      if (isNaN(parseFloat(data.data[i][15])) || isNaN(parseFloat(data.data[i][16]))) {
        continue;
      }
      temp.push({ lat: parseFloat(data.data[i][15]), lng: parseFloat(data.data[i][16]) });
      if (isNaN(parseFloat(data.data[i][17])) || isNaN(parseFloat(data.data[i][18]))) {
        continue;
      }
      temp.push({ lat: parseFloat(data.data[i][17]), lng: parseFloat(data.data[i][18]) });
    }
    debugger; // eslint-disable-line no-debugger
    setheatMapData(temp);
    setData(data.data);
    return data;
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item={true} xs={6}>
        <BasicTable columns={['Total Cases', 'Total Deaths', 'Total Hospitalizations', 'CreatedAt', 'UpdatedAt']} rows={data} />
      </Grid>
      <Grid item={true} xs={6}>
        <MapContainer center={{ lat: 41.8781, lng: -87.6298 }} zoom={14} positions={heatMapData} />
      </Grid>
    </Grid>
  );
}

export default Covid19;
