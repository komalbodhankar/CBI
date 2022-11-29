import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import BasicTable from './table/table';
import PaginationTable from './table/pagination_table'

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
      <PaginationTable columns={['Id', 'Build Id', 'Permit Id', 'Permit Type', 'Address', 'ZipCode', 'Latitude', 'Longitude', 'Paid-Total', 'Unpaid-Total', 'Waived-Total', 'CreatedAt', 'UpdatedAt']} rows={data} />
    </>
  );
}

export default BuildingPermit;
