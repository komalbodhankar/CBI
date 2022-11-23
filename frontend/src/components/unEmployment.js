import React, { useEffect, useState } from 'react'
import axios from 'axios'
import BasicTable from './table/table'

function UnEmployment () {
  const [data, setPoverty] = useState([])
  const [unemp, setUnemp] = useState([])
  // const [data, setUnemp] = useState([])

  const getData = async () => {
    const data = await axios.get('http://127.0.0.1:5000/unEmployment', setTimeout(4000))
    setPoverty(data.data[0])
    console.log(data)
  }

  const getUnemp = async () => {
    const unemp = await axios.get('http://127.0.0.1:5000/unEmployment', setTimeout(4000))
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
    <>
      <BasicTable columns={['areaCode', 'areaName', 'belowPoverty']} rows={data} />
      <BasicTable columns={['areaCode', 'areaName', 'unempRate']} rows={unemp} />
    </>
  )
}

export default UnEmployment
