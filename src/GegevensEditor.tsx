import { InputAdornment, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { Data } from "./App";
import prices from './data/prices.json'
import BoltIcon from '@mui/icons-material/Bolt';
import HomeIcon from '@mui/icons-material/Home';
import { LensTwoTone, LocalFireDepartment, VolumeDown, VolumeUp } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function createData(
  naam: string,
  elek: number,
  gas: number,
  base: number,
  energieLabel: number | null,
  url: string,
  electrictyUsage: number,
  gasUsage: number,
): Data {
  const maand = (elek * electrictyUsage + gas * gasUsage + base) / 12
  return { naam: { naam: naam, url: url }, elek: elek, gas: gas, maand: maand, energieLabel: energieLabel };
}

interface Props {
  setRows: (data: Data[]) => void
}
export function GegevensEditor({setRows}: Props) {

  const [postcode, setPostcode] = useState("9712JG")
  const [isValidPostcode, setIsValidPostcode] = useState(true)
  const [electricityUsage, setElectricityUsage] = useState(2500)
  const [gasUsage, setGasUsage] = useState(1200)

  useEffect(() => {

    setRows(
      prices.map(price =>
        createData(price.naam, price.price_electricity, price.price_gas, price.costs_base, price.energielabel, price.url, electricityUsage, gasUsage)
      ))
  }, [])

  useEffect(() => {
    const expr = new RegExp("^[0-9]{4} ?[a-zA-Z]{2}$")
    const isValid = expr.test(postcode)
    setIsValidPostcode(isValid)
  }, [postcode])



  useEffect(() => {
    setRows(
      prices.map(price =>
        createData(price.naam, price.price_electricity, price.price_gas, price.costs_base, price.energielabel, price.url, electricityUsage, gasUsage)
      ))
  }, [gasUsage, electricityUsage])


  return <div className="p-2 mx-6 bg-teal-400 pb-4">
    <div className="text-center text-white">

    {/* <ExpandMoreIcon /> */}
    </div>
    <div className="text-xl font-bold text-center text-teal-50 mb-2">verbruik</div>

    <div className="gap-5 grid grid-cols-3 w-full px-2">


      <TextField
        variant="standard"
        label="postcode"
        size="small"
        error={!isValidPostcode}
        helperText={!isValidPostcode && "ongeldige postcode"}
        // disabled
        value={postcode}
        sx={{ color: 'white' }}
        onChange={(event) => {
          const s = event.currentTarget.value
          setPostcode(s)
        }}
      // InputLabelProps={{
      //   style: { color: '#fff', accentColor: '#fff', borderBottomColor: '#fff' },
      // }}
      // InputProps={{
      //   startAdornment: (
      //     <InputAdornment position="start">
      //       <HomeIcon />
      //     </InputAdornment>
      //   ),
      // }}

      />
      <TextField
        variant="standard"
        label="stroom"
        size="small"
        value={electricityUsage}
        onChange={(event) => {
          const value = event.currentTarget.value
          const onlyNumbers = value.replace(/\D/g, '')
          const numberValue = onlyNumbers === '' ? 0 : parseInt(onlyNumbers)
          if (numberValue > 10000) return
          setElectricityUsage(numberValue)
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <BoltIcon />
            </InputAdornment>
          ),
          endAdornment: <InputAdornment position="end"><div className="text-xs">kWh</div></InputAdornment>
        }}

      />
      <TextField
        variant="standard"
        label="gas"
        size="small"
        value={gasUsage}
        onChange={(event) => {
          const value = event.currentTarget.value
          const onlyNumbers = value.replace(/\D/g, '')
          const numberValue = onlyNumbers === '' ? 0 : parseInt(onlyNumbers)
          if (numberValue > 10000) return
          setGasUsage(numberValue)
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocalFireDepartment />
            </InputAdornment>
          ),
          endAdornment: <InputAdornment position="end"><div className="flex flex-col text-xs"><div>m³</div></div></InputAdornment> // 
        }}

      />
    </div>

  </div>
}