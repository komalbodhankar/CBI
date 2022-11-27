import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BasicTable from './table/table';

function TaxiTrips () {
  const [data, setData] = useState([]);

  const getData = async () => {
    const data = await axios.get('http://127.0.0.1:5000/taxiTrips', setTimeout(4000));
    setData(data.data);
    return data;
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <BasicTable columns={['Trip ID', 'Trip Start Time', 'Trip End Time', 'Trip Secs', 'Trip Miles', 'Pick-up Area', 'Drop-off Area', 'Fair', 'Tips', 'Tolls', 'Extras', 'Trip Total', 'Payment Type', 'Company', 'Src Latitude', 'Src Longitude', 'Dest Latitude', 'Dest Longitude']} rows={data} />
    </>
  );
}

export default TaxiTrips;
