import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BasicTable from './table/table';
import { Grid } from '@mui/material';
import MapContainer from './maps/HeatMap';
import BarChart from './charts/BarChart';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function TaxiTrips () {
  const [data, setData] = useState([]);
  const [heatMapData, setheatMapData] = useState([]);
  const [pdataSource, setPDataSource] = useState([]);
  const [ddataSource, setDDataSource] = useState([]);
  const [view, setView] = useState('Pattern');
  const chartColumns = [
    { value: 'Count', name: 'Count' }
  ];
  const getPickUpData = async () => {
    const data = await axios.get('http://127.0.0.1:5000/taxiTripsMostPickups', setTimeout(4000), { crossOriginIsolated: true });
    let temp = [];
    for(let i=0;i<data.data.length;i++){
      temp.push({"pzipcode":data.data[i][0],"Count":data.data[i][1]})
    }
    setPDataSource(temp);
  };
  const getDropOffData = async () => {
    const data = await axios.get('http://127.0.0.1:5000/taxiTripsDropOffs', setTimeout(4000), { crossOriginIsolated: true });
    let temp = [];
    for(let i=0;i<data.data.length;i++){
      temp.push({"pzipcode":data.data[i][0],"Count":data.data[i][1]})
    }
    setDDataSource(temp);
  };

  const getData = async () => {
    const data = await axios.get('http://127.0.0.1:5000/taxiTrips', setTimeout(4000));
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
    let temp2 =[]
    for(let i=0;i<data.data.length;i++){
      temp2.push([new Date(data.data[i][2]).toLocaleDateString(),data.data[i][19],data.data[i][20],data.data[i][4]+" secs",data.data[i][5]+" mi",data.data[i][14]])
    }
    setData(temp2);
  };
  useEffect(() => {
    getData().then(()=>getPickUpData().then(()=>getDropOffData()))
  }, []);

  return (
<>
<Stack display="flex" justifyContent={'flex-end'} mb = {2} spacing={2} direction="row">
        <Button variant="contained" sx={{ fontSize: 10 }} style={{backgroundColor: "#21b6ae"}} onClick={() => { setView('Pattern'); }}>Traffic Patterns</Button>
        <Button variant="contained" sx={{ fontSize: 10 }} style={{backgroundColor: "#21b6ae"}} onClick={() => { setView('PickUp'); }}>Most Pickup Spots</Button>
        <Button variant="contained" sx={{ fontSize: 10 }} style={{backgroundColor: "#21b6ae"}} onClick={() => { setView('Dropoffs'); }}>Most Dropoff Spots</Button>
        <Button variant="contained" sx={{ fontSize: 10 }} style={{backgroundColor: "#21b6ae"}} onClick={() => { setView('Trips'); }}>Taxi Trips</Button>
</Stack>
{ 
(view === 'Pattern') && (
  <><h1>Taxi Trips Hotspots</h1><MapContainer center={{ lat: 41.8781, lng: -87.6298 }} zoom={14} positions={heatMapData} />
       </> )
        }
{ (view === 'Trips') && (
  <><h1>Taxi Trips</h1>
        <BasicTable columns={["Trip date", 'Pick-up Area', 'Drop-off Area','Trip Secs', 'Trip Miles',"Taxi Service"]} rows={data} />
        
        </>)}
{ (view === 'PickUp') && (
  <><h1>Best Pickup Spots</h1>
    <BarChart rows={pdataSource} columns={chartColumns} argumentField={'pzipcode'} />
    </>
  )}
  { (view === 'Dropoffs') && (
    <><h1>Most Dropoff Spots</h1>
    <BarChart rows={ddataSource} columns={chartColumns} argumentField={'pzipcode'} />
    </>
  )}
    </>
  );
}

export default TaxiTrips;
