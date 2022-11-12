import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BasicTable from './table/table';

const UnEmployment = () => {
  const [data, setData] = useState([]);

  const getData = async () => {
    const data = await axios.get('http://127.0.0.1:5000/unEmployment');
    setData(data.data);
    return data;
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <BasicTable columns={[1, 2, 3, 4, 5, 6, 7, 8]} rows={data} />
    </>
  );
};

export default UnEmployment;
