import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import BasicTable from './table/table';
import PaginationTable from './table/pagination_table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function BuildingPermit () {
  const [data, setData] = useState([]);

  const getData = async () => {
    const data = await axios.get('http://127.0.0.1:5000/buildingPermit', setTimeout(4000), { crossOriginIsolated: true });
    setData(data.data);
    console.log(data);
    return data;
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Stack display="flex" justifyContent={"flex-end"} mb = {2} spacing={2} direction="row">
        <Button variant="contained" color="primary" href="/buildingpermitChart">Chart</Button>
      </Stack>
      <PaginationTable columns={['Build Id', 'Permit Id', 'Permit Type', 'Address', 'ZipCode', 'Community', 'perCapita', 'CreatedAt', 'UpdatedAt']} rows={data} />
    </>
  );
}

export default BuildingPermit;
