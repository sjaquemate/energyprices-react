import axios from 'axios';
import * as React from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function Row() {
  return <>
    <div className="bg-neutral-200 w-full h-8">

    </div>
  </>
}
export default function AppRawData() {

  type Data = any[]
  const [data, setData] = React.useState<Data>([])
  // const url = "https://filesamples.com/samples/code/json/sample2.json"
  const url = "https://raw.githubusercontent.com/sjaquemate/energy/main/tarieven.json"
  React.useEffect(() => {
    axios.get(url)
      .then(res => res.data)
      .then(data => setData(data))
  }, [])


  return (
    <div className="">
      <Row />
      <div className="bg-slate-300 w-1/2 h-1/2">
        hi
        {/* <ResponsiveContainer width="100%" height="100%"> */}
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="price_gas" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="price_elec" stroke="#82ca9d" />
        </LineChart>
        {/* </ResponsiveContainer> */}
      </div>

      <pre>
        {JSON.stringify(data, null, 2)}

      </pre>
    </div>
  )
}
