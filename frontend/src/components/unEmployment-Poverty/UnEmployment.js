import React, {
  useEffect,
  useState
} from 'react';
import axios from 'axios';
// import BasicTable from '../table/table';
// import { Grid } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import PaginationTable from '../table/pagination_table';
import MapContainer from './Maps';
import { Link } from '@mui/material';

function UnEmployment () {
  const [data, setPoverty] = useState([]);
  const [unemp, setUnemp] = useState([]);
  const [view, setView] = useState('map');
  const unempColumns = ['Area Code', 'Community Area', 'UnEmployment(%)'];
  const povertyColumns = ['Area Code', 'Community Area', 'Poverty(%)'];
  // const permitMapPovertyColumns = [''];
  // const [view, setView] = useState('table');

  const getData = async () => {
    const data = await axios.get('http://127.0.0.1:5000/unEmployment', setTimeout(4000));
    setPoverty(data.data[0]);
    console.log(data);
  };

  const getUnemp = async () => {
    const unemp = await axios.get('http://127.0.0.1:5000/unEmployment', setTimeout(6000));
    setUnemp(unemp.data[1]);
    console.log(unemp);
  };

  useEffect(() => {
    const getAllData = async () => {
      await getData();
      await getUnemp();
    };
    getAllData();
  }, []);

  useEffect(() => {
    if (view === 'unemp-table') {
      getUnemp();
    } else if (view === 'poverty-table') {
      getData();
    }
  }, [view]);

  return (
    <>
      <Stack display="flex" justifyContent={'flex-end'} mb = {2} spacing={2} direction="row">
        <Link href="/"><Button variant="contained" sx={{ fontSize: 10 }} style={{backgroundColor: "#21b6ae"}}>Home</Button></Link>
        <Button variant="contained" sx={{ fontSize: 10 }} style={{backgroundColor: "#21b6ae"}} onClick={() => { setView('map'); }}>Permit Waiver Map</Button>
        <Button variant="contained" sx={{ fontSize: 10 }} style={{backgroundColor: "#21b6ae"}} onClick={() => { setView('unemp-table'); }}>UnEmploymentRate Table</Button>
        <Button variant="contained" sx={{ fontSize: 10 }} style={{backgroundColor: "#21b6ae"}} onClick={() => { setView('poverty-table'); }}>PovertyRate Table</Button>
      </Stack>
      { view === 'unemp-table' && (<PaginationTable columns={unempColumns} rows={unemp} />)}
      { view === 'poverty-table' && (<PaginationTable columns={povertyColumns} rows={data} />)}
      { view === 'map' && (<MapContainer />)}
    </>
    // <Grid container spacing={2}>
    //   <Grid item={true} xs={6}>
    //     <Grid item={ true } mb={2} mr = {2}>
    //       <BasicTable backgroundColor= '#FF0000' columns={['Area Code', 'Community Area', 'Below Poverty(%)']} rows={data} />
    //     </Grid>
    //     <Grid item={ true } mb = {2} mr = {2}>
    //       <BasicTable columns={['Area Code', 'Community Area', 'UnEmployment(%)']} rows={unemp} />
    //     </Grid>
    //   </Grid>
    //   <Grid item={true} xs={6}>
    //     <MapContainer />
    //   </Grid>
    // </Grid>
  );
}

export default UnEmployment;
