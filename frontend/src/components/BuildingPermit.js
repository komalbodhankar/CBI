import React, { useEffect, useState } from 'react'
import axios from 'axios'
import BasicTable from './table/table'

function BuildingPermit () {
  const [data, setData] = useState([])

  const getData = async () => {
    const data = await axios.get('http://127.0.0.1:5000/buildingPermit', setTimeout(4000))
    setData(data.data)
    return data
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <BasicTable columns={['Id', 'Permit Id', 'Permit Type', '', 5, 6, 7, 8, 9, 10]} rows={data} />
    </>
  )
}

export default BuildingPermit
