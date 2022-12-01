import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import PaginationTable from './table/pagination_table';
import BarChart from './charts/BarChart';

function Covid19Zip () {
  const [data, setData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [coldata, setColData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [heatMapData, setheatMapData] = useState([]);
  const [view, setView] = useState('table');
  const columns = ['Id', 'Zip Code', 'Tests', 'Percent - Tested Positive', 'Deaths', 'latitude', 'longitude', 'CreatedAt', 'UpdatedAt'];

  const chartColumns = [
    { value: 'Percent', name: 'Percent - Tested Positive' }
  ];

  const getData = async () => {
    const data = await axios.get('http://127.0.0.1:5000/covid19Zip', setTimeout(4000));
    const temp = [];
    for (let i = 0; i < data.data.length; i++) {
      if (isNaN(parseFloat(data.data[i][5])) || isNaN(parseFloat(data.data[i][6]))) {
        continue;
      }
      temp.push({ lat: parseFloat(data.data[i][5]), lng: parseFloat(data.data[i][6]) });
    }
    setheatMapData(temp);
    setData(data.data);
  };

  const getColumnData = async () => {
    const coldata = await axios.get('http://127.0.0.1:5000/covid19columns', setTimeout(4000));
    setColData(coldata.data);
    for (let i = 0; i < coldata.data.length; i++) {
      if (coldata.data[i].ZipCode === '60603') {
        coldata.data[i].ZipCode = '60638';
      }
    }
    console.log(coldata);
  };
  useEffect(() => {
    getData();
    getColumnData();
  }, []);

  useEffect(() => {
    if (view === 'table') {
      getData();
    } else if (view === 'barChart') {
      getColumnData();
    }
  }, [view]);

  return (
    <>
      <Stack display="flex" justifyContent={'flex-end'} mb = {2} spacing={2} direction="row">
        <Link href="/"><Button variant="contained" sx={{ fontSize: 10 }} color="primary">Home</Button></Link>
        <Button variant="contained" sx={{ fontSize: 10 }} color="primary" onClick={() => { setView('table'); }}>Show Table</Button>
        <Button variant="contained" sx={{ fontSize: 10 }} color="primary" onClick={() => { setView('barChart'); }}>Covid-19 Chart</Button>
        {/* <Button variant="contained" sx={{ fontSize: 10 }} color="primary" onClick={() => { setView('map'); }}>Emergency Loan Map</Button> */}
      </Stack>
      { view === 'table' && (<PaginationTable columns={columns} rows={data} />)}
      { view === 'barChart' && (<BarChart rows={coldata} columns={chartColumns} argumentField={'ZipCode'} />)}
    </>
  );
}

export default Covid19Zip;
