import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import BasicTable from './table/table';
// import { Grid } from '@mui/material';
// import MapContainer from './maps/HeatMap';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link } from '@mui/material';
import PaginationTable from './table/pagination_table';
import BarChart from './charts/BarChart';

function Covid19 () {
  const [data, setData] = useState([]);
  const [view, setView] = useState('table');
  // eslint-disable-next-line no-unused-vars
  const [heatMapData, setheatMapData] = useState([]);
  const columns = ['Total Cases', 'Total Deaths', 'Total Hospitalizations', 'CreatedAt', 'UpdatedAt'];
  const chartColumns = [
    { value: 'Count', name: 'Count' }
  ];
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
    setheatMapData(temp);
    setData(data.data);
    return data;
  };
  const getCovidChartData = async () => {
    const data = await axios.get('http://127.0.0.1:5000/ccvi', setTimeout(4000));
    setData(data.data);
    console.log(data);
    const len = [data.data.length - 1];
    const da = data.data[len][0];
    // eslint-disable-next-line no-unused-vars
    const mydate = new Date(da);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (view === 'table') {
      getData();
    } else if (view === 'barChart') {
      getCovidChartData();
    }
  }, [view]);

  return (
    <>
      <Stack display="flex" justifyContent={'flex-end'} mb = {2} spacing={2} direction="row">
        <Link href="/"><Button variant="contained" sx={{ fontSize: 10 }} color="primary">Home</Button></Link>
        <Button variant="contained" sx={{ fontSize: 10 }} color="primary" onClick={() => { setView('table'); }}>Show Table</Button>
        <Button variant="contained" sx={{ fontSize: 10 }} color="primary" onClick={() => { setView('barChart'); }}>Covid Bar Chart</Button>
        <Button variant="contained" sx={{ fontSize: 10 }} color="primary" onClick={() => { setView('map'); }}>Emergency Loan Map</Button>
      </Stack>
      { view === 'table' && (<PaginationTable columns={columns} rows={data} />)}
      { view === 'barChart' && (<BarChart rows={data} columns={chartColumns} argumentField={'ZipCode'} />)}
      {/* { view === 'map' && (<PermitMapContainer />)} */}
    </>
    // <Grid container spacing={2}>
    //   <Grid item={true} xs={6}>
    //     <BasicTable columns={['Total Cases', 'Total Deaths', 'Total Hospitalizations', 'CreatedAt', 'UpdatedAt']} rows={data} />
    //   </Grid>
    //   <Grid item={true} xs={6}>
    //     <MapContainer center={{ lat: 41.8781, lng: -87.6298 }} zoom={14} positions={heatMapData} />
    //   </Grid>
    // </Grid>
  );
}

export default Covid19;
