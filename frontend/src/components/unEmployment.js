import React, { useEffect, useState } from 'react'
import axios from 'axios'
import BasicTable from './table/table'
import { Grid } from '@mui/material'

function UnEmployment () {
  const [data, setPoverty] = useState([])
  const [unemp, setUnemp] = useState([])

  const getData = async () => {
    const data = await axios.get('http://127.0.0.1:5000/unEmployment', setTimeout(4000), { crossOriginIsolated: true })
    setPoverty(data.data[0])
    console.log(data)
  }

  const getUnemp = async () => {
    const unemp = await axios.get('http://127.0.0.1:5000/unEmployment', setTimeout(4000), { crossOriginIsolated: true })
    setUnemp(unemp.data[1])
    console.log(unemp)
  }

  useEffect(() => {
    const getAllData = async () => {
      await getData()
      await getUnemp()
    }
    getAllData()
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid BasicTable xs={5} mb={2} mr = {2}>
        <BasicTable columns={['areaCode', 'areaName', 'belowPoverty']} rows={data} />
      </Grid>
      <Grid xs={5}>
          chart
      </Grid>
      <Grid BasicTable xs={5} mb = {2} mr = {2}>
        <BasicTable columns={['areaCode', 'areaName', 'unempRate']} rows={unemp} />
      </Grid>
      <Grid xs={5}>
        chart
      </Grid>
    </Grid>
  )
}

export default UnEmployment
