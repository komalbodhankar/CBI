import React, { useEffect, useState } from 'react'
import axios from 'axios'
import BasicTable from './table/table'

function CCVI () {
  const [data, setData] = useState([])

  const getData = async () => {
    const data = await axios.get('http://127.0.0.1:5000/ccvi', setTimeout(4000))
    setData(data.data)
    return data
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <BasicTable columns={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]} rows={data} />
    </>
  )
}

export default CCVI
