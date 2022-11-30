import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pie from './charts/PieChart';
import LineChart from './charts/LineChart';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const chartArgumentField = "date";
const chartColumns = [
  { value: 'forecast_value', name:'Forecasted number of Cases'}
];
function CCVI () {
  const [startDate, setStartDate] = useState(new Date());
  const [minDate, setMinDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);
  const [covidCases, setCovidCases] = useState([]);
  const [covidDeaths, setCovidDeaths] = useState([]);
  const [seed, setSeed] = useState(1);
  const getData = async () => {
    const data = await axios.get('http://127.0.0.1:5000/ccvi', setTimeout(4000));
    setData(data.data);
    var temp = [];
    debugger;

    var len = [data.data.length - 1];
    var da = data.data[len][0];
    var mydate = new Date(da);
    setMinDate(mydate);
    setStartDate(new Date(data.data[0][0]))
    temp.push({ Race: 'Latin', Affected: parseInt(data.data[0][4]) });
    temp.push({ Race: 'Asian', Affected: parseInt(data.data[0][5]) });
    temp.push({ Race: 'Black', Affected: parseInt(data.data[0][6]) });
    temp.push({ Race: 'White', Affected: parseInt(data.data[0][7]) });
    temp.push({ Race: 'Other', Affected: parseInt(data.data[0][8]) });
    temp.push({ Race: 'Unknown', Affected: parseInt(data.data[0][9]) });
    setCovidCases(temp);  
    var temp2 = [];
    temp2.push({ Race: 'Latin', Affected: parseInt(data.data[0][10]) });
    temp2.push({ Race: 'Asian', Affected: parseInt(data.data[0][11]) });
    temp2.push({ Race: 'Black', Affected: parseInt(data.data[0][12]) });
    temp2.push({ Race: 'White', Affected: parseInt(data.data[0][13]) });
    temp2.push({ Race: 'Other', Affected: parseInt(data.data[0][14]) });
    temp2.push({ Race: 'Unknown', Affected: parseInt(data.data[0][15]) });
    setCovidDeaths(temp2)
    return data;
  };
  const getForecastData = async () => {      

    const data = await axios.get('http://127.0.0.1:5000/forecastCovid19', setTimeout(4000));
    debugger;
    setRows(data.data);
  }
  useEffect(() => {
    getData().then(()=>
    getForecastData());
  }, []);
  const setPieChart = (date) =>{
    setStartDate(date)
    const diffTime = Math.abs(startDate - minDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    var temp = [];
    var len = [data.length - 1];
    temp.push({ Race: 'Latin', Affected: parseInt(data[len-diffDays][4]) });
    temp.push({ Race: 'Asian', Affected: parseInt(data[len-diffDays][5]) });
    temp.push({ Race: 'Black', Affected: parseInt(data[len-diffDays][6]) });
    temp.push({ Race: 'White', Affected: parseInt(data[len-diffDays][7]) });
    temp.push({ Race: 'Other', Affected: parseInt(data[len-diffDays][8]) });
    temp.push({ Race: 'Unknown', Affected: parseInt(data[len-diffDays][9]) });
    setCovidCases(temp);  
    setSeed(Math.random());
  }
  return (
    <>
    <label>Date:</label><DatePicker selected={startDate} minDate={minDate} onChange={(date:Date) => setPieChart(date)} />
    <Pie key={seed} va={covidCases}></Pie>
    <LineChart reportType={'forecasted_data'} rows={rows} columns={chartColumns} argumentField={chartArgumentField}/>
    </>
  );
}

export default CCVI;