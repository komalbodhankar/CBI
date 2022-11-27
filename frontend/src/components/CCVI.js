import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BasicTable from './table/table';

function CCVI () {
  const [data, setData] = useState([]);

  const getData = async () => {
    const data = await axios.get('http://127.0.0.1:5000/ccvi', setTimeout(4000));
    setData(data.data);
    return data;
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <BasicTable columns={['LabReportDate', 'CasesTotal', 'DeathsTotal', 'HospitalizationsTotal', 'CasesLatinx', 'CasesAsian', 'CasesBlack', 'CasesWhite', 'CasesOther', 'CasesUnknownRace', 'DeathsLatin', 'DeathsAsian', 'DeathsBlack', 'DeathsWhite', 'DeathsOther', 'DeathsUnknownRace', 'HospitalizationsLatin', 'HospitalizationsAsian', 'HospitalizationsBlack', 'HospitalizationsWhite']} rows={data} />
    </>
  );
}

export default CCVI;
