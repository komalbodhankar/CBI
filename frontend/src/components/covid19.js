import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BasicTable from './table/table';

function Covid19 () {
  const [data, setData] = useState([]);

  const getData = async () => {
    const data = await axios.get('http://127.0.0.1:5000/covid19', setTimeout(4000));
    setData(data.data);
    return data;
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <BasicTable columns={['Total Cases', 'Total Deaths', 'Total Hospitalizations', 'CreatedAt', 'UpdatedAt']} rows={data} />
    </>
  );
}

export default Covid19;
