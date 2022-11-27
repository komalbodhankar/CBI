import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BasicTable from './table/table';

function Covid19Zip () {
  const [data, setData] = useState([]);

  const getData = async () => {
    const data = await axios.get('http://127.0.0.1:5000/covid19Zip', setTimeout(4000));
    setData(data.data);
    console.log(data.data);
    return data;
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <BasicTable columns={['Id', 'Zip Code', 'Tests', 'Percent - Tested Positive', 'Deaths', 'CreatedAt', 'UpdatedAt']} rows={data} />
    </>
  );
}

export default Covid19Zip;
