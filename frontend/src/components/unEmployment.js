import React, {
  useEffect,
  useState
} from 'react';
import axios from 'axios';
import BasicTable from './table/table';
import { Grid } from '@mui/material';
import MapContainer from './maps/Maps';

function UnEmployment () {
  const [data, setPoverty] = useState([]);
  const [unemp, setUnemp] = useState([]);

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

  return (
    <Grid container spacing={2}>
      <Grid item={true} xs={6}>
        <Grid item={ true } mb={2} mr = {2}>
          <BasicTable columns={['Area Code', 'Community Area', 'Below Poverty(%)']} rows={data} />
        </Grid>
        <Grid item={ true } mb = {2} mr = {2}>
          <BasicTable columns={['Area Code', 'Community Area', 'UnEmployment(%)']} rows={unemp} />
        </Grid>
      </Grid>
      <Grid item={true} xs={6}>
        <MapContainer />
      </Grid>
    </Grid>
  );
}

export default UnEmployment;
