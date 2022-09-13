import axios from 'axios';
import * as React from 'react';

export default function AppRawData() {

  const [data, setData] = React.useState({})
  // const url = "https://filesamples.com/samples/code/json/sample2.json"
  const url = "https://raw.githubusercontent.com/sjaquemate/energy/main/tarieven.json"
  React.useEffect(() => {
    axios.get(url)
      .then(res => res.data)
      .then(data => setData(data))
  }, [])

  return (
    <div className="">
      <pre>
        {JSON.stringify(data, null, 2)}

      </pre>
    </div>
  )
}
