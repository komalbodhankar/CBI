import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import BasicTable from './table/table';
import PaginationTable from '../table/pagination_table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import BarChart from '../charts/BarChart';
import PermitMapContainer from './PermitMap';
import { Link } from '@mui/material';
// import DashBoard from '../home/home';

function BuildingPermit () {
  const [data, setData] = useState([]);
  const [view, setView] = useState('table');
  const columns = ['Build Id', 'Permit Id', 'Permit Type', 'Address', 'ZipCode', 'Community', 'perCapita', 'CreatedAt', 'UpdatedAt'];
  const [dataSource, setDataSource] = useState([]);
  // const permitColumns = ['Count', 'PerCapita', 'PermitType', 'ZipCode'];
  const chartColumns = [
    { value: 'Count', name: 'Count' }
  ];

  const getData = async () => {
    const data = await axios.get('http://127.0.0.1:5000/buildingPermit', setTimeout(4000), { crossOriginIsolated: true });
    setData(data.data);
    console.log(data);
    return data;
  };

  const getPermitCountChart = async () => {
    const data = await axios.get('http://127.0.0.1:5000/permitCountChart', setTimeout(4000), { crossOriginIsolated: true });
    setDataSource(data.data);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log(dataSource);
  }, [dataSource]);

  useEffect(() => {
    if (view === 'barChart') {
      getPermitCountChart();
    }
  }, [view]);

  return (
    <>
      <Stack display="flex" justifyContent={'flex-end'} mb = {2} spacing={2} direction="row">
        <Link href="/"><Button variant="contained" sx={{ fontSize: 10 }} color="primary">Home</Button></Link>
        <Button variant="contained" sx={{ fontSize: 10 }} color="primary" onClick={() => { setView('table'); }}>Show Table</Button>
        <Button variant="contained" sx={{ fontSize: 10 }} color="primary" onClick={() => { setView('barChart'); }}>Permit Count Chart</Button>
        <Button variant="contained" sx={{ fontSize: 10 }} color="primary" onClick={() => { setView('map'); }}>Emergency Loan Map</Button>
      </Stack>
      { view === 'table' && (<PaginationTable columns={columns} rows={data} />)}
      { view === 'barChart' && (<BarChart rows={dataSource} columns={chartColumns} argumentField={'ZipCode'} />)}
      { view === 'map' && (<PermitMapContainer />)}
    </>
  );
}

export default BuildingPermit;
