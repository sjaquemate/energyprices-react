import { Slider, Table } from "@mui/material";
import React, { useEffect, useState } from "react";
import DataTable from "./datatable";
import { prices } from "./gas";
import EuroIcon from '@mui/icons-material/Euro';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BoltIcon from '@mui/icons-material/Bolt';
import { styled } from '@mui/material/styles';


function DataRow() {
  return (
    <div className="rounded-md flex flex-row bg-neutral-300 gap-5 px-3">
      <div className=""> naam </div>
      <div> 2.1 €/kWh </div>
      <div> 3.1 €/m³ </div>
    </div>
  )
}
function DataGrid() {
  return (
    <div className="flex flex-col gap-1 items-center">
      <DataRow />
      <DataRow />
      <DataRow />
      <DataRow />
      <DataRow />
      <DataRow />
      <DataRow />
    </div>
  )
}
interface Props {
  last: boolean
}

function PrototypeTableRow(props: Props) {
  return (
    <tr className={`flex w-full bg-blue-300 px-5 ${props.last && "rounded-b-xl"}`}>
      <td className="w-2/5"> <div className="text-red-700">Dogs</div></td>
      <td className="w-1/5">0.09</td>
      <td className="w-1/5">1.89</td>
      <td className="w-1/5">249</td>
    </tr>
  )
}
function PrototypeTable() {

  const items = ['item1', 'item2', 'item3']

  return (
    <div className="select-none">

      <Table>

        <thead>
          <tr className="bg-neutral-500 flex text-left w-full rounded-t-xl px-5 py-1">
            <th className="w-2/5">One</th>
            <th className="w-1/5">€/m³</th>
            <th className="w-1/5">€/kWh</th>
            <th className="w-1/5">€/maand</th>
          </tr>
        </thead>

        <tbody className="flex flex-col items-center justify-between w-full py-1">
          {items.map((items, index) => <PrototypeTableRow last={index === 2} />)}
        </tbody>

      </Table>
    </div>

  )
}

function TailwindTableSimple() {
  const [sortGas, setSortGas] = useState(false)

  const [sortedPrices, setSortedPrices] = useState(prices)
  useEffect(() => {
    console.log(sortGas)
    if (sortGas) {
      setSortedPrices(prev => prev.sort((a, b) => a.gas - b.gas))
    }

  }, [sortGas])

  const svg = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 21l12-18 12 18z" /></svg>

  const [transValue, setTransValue] = useState(100)

  const activateLasers = () => {
    console.log('activate')
    setTransValue(prev => prev === 100 ? 200 : 100)
    setOrder(prev => prev[0] === 0 ? prev.reverse() : prev.sort())
  }
  console.log(transValue)

  const names = ["Essent", "Budget energie", "Budget energie", "Budget energie", "Budget energie", "Budget energie", "Budget energie", "Budget energie", "Budget energie", "Budget energie", "Budget energie", "Budget energie", "Budget energie", "Budget energie", "Budget energie", "Budget energie", "Budget energie"]
  const [order, setOrder] = useState(names.map((_, index) => index))

  return (
    <>
      {/* <div className="relative text-white"> 
      <div style={{zIndex:(1000-order[0])}} className={`animate-pulse absolute bg-black transition duration-200 translate-y-[${order[0]*100}%]`}>hello </div> 
      <div style={{zIndex:(1000-order[1])}} className={`delay-100 absolute bg-red-500 transition duration-200 translate-y-[${order[1]*100}%]`}>bye</div> 
    </div> */}
      <div className="inline-block">
        <button className="font-bold mb-5 bg-red-100" onClick={activateLasers}>
          Activate Lasers
        </button>
        <div className="fixed top-0 w-full grid grid-flow-row-dense grid-cols-4">
          <div>hi</div>
          <div>hi</div>
          <div>hi</div>
          <div>hi</div>
        </div>
        <div className="text-black">
          {["first", ...names].map((name, index) => {
            const isHeader = index === 0
            const ord = order[index - 1]
            const isEven = ord % 2 === 0
            let bgColor = ''
            if (!isHeader) {
              bgColor = isEven ? 'bg-slate-100' : 'bg-slate-100'
            }
            const props: React.HTMLAttributes<HTMLDivElement> = {
              className: `
                    rounded-xl
                    px-5 py-2
                    ${bgColor}
                    bg-opacity-100
                    transform transition ease-in-out duration-1000
                  `,
              style: { zIndex: (1000 - ord), transform: `translate(0px, ${isHeader ? 0 : (ord - index + 1) * 100 + ord * 10}%)` }

            }
            console.log(index, ord, (ord - index) * 100)
            return (
              <div
                key={index}
                {...props}
              >

                <div className="grid grid-flow-row-dense grid-cols-4">
                  {
                    isHeader ? <>
                      <div> </div>
                      <div className="fixed top-0 left-0 right-0 flex flex-col items-end gap-1">
                        <div className="text-blue-500 bg-slate-100 font-bold rounded-full flex h-10 w-10 items-center justify-center">
                          <LocalFireDepartmentIcon />
                        </div>
                        <div className="bg-slate-100 px-3 py-[0.5] rounded-full text-center">
                          gas
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="text-blue-500 bg-slate-100 font-bold rounded-full flex h-10 w-10 items-center justify-center">
                          <BoltIcon />
                        </div>
                        <div className="bg-slate-100 px-3 py-[0.5] rounded-full text-center">
                          stroom
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="text-red-500 bg-slate-100 font-bold rounded-full flex h-10 w-10 items-center justify-center">
                          <CalendarMonthIcon />
                        </div>
                        <div className="bg-slate-100 px-3 py-[0.5] rounded-full text-center">
                          maand
                        </div>
                      </div>


                    </>
                      :
                      <>
                        <div className="whitespace-nowrap text-right-">{name}</div>
                        <div className="flex flex-col leading-5 ml-auto gap-2">
                          <div className="text-zinc-600 text-xxs italic">
                            €/kwh
                          </div>
                          <div className="text-xl">
                            {Math.random().toFixed(2)}
                          </div>
                        </div>
                        <div className="flex flex-col leading-5 ml-auto gap-2">
                          <div className="text-zinc-600 text-xxs italic">
                            €/m³
                          </div>
                          <div className="text-xl">
                            {Math.random().toFixed(2)}
                          </div>
                        </div>
                        <div className="flex flex-col leading-5 ml-auto gap-2">
                          <div className="text-zinc-600 text-xxs italic">
                            €/mnd
                          </div>
                          <div className="text-xl">
                            {(300 * Math.random()).toFixed(2)}
                          </div>
                        </div>
                      </>
                  }
                </div>
              </div>
            )

          })}
        </div>


      </div>

      {/* <div className="grid grid-cols-5 gap-6 text-md text-white ">

        <div className="col-span-2"></div>
        <div className="flex flex-row ">
          <div>Gas</div>
          <button
            className=""
            onClick={() => setSortGas(prev => !prev)}>
            {svg}
          </button>
        </div>
        <div className="text-center">Stroom</div>
        <div className="text-center">Maand</div>

        <div className="flex flex-col">
          <div className={`transition ease-in-out translate-y-[${transValue}%]`}>hello</div>
          <div className={`transition ease-in-out translate-y-[${transValue * 2 - 100}%]`}>hello</div>
        </div>

        {
          sortedPrices.map(price => (
            <>
              <div className="col-span-2 text-right">
                {price.naam}
              </div>
              <div className="flex flex-row text-right">
                <div className="text-opacity-20">€ hoi</div> {' '} {price.gas}
              </div>
              <div className="text-center">
                € 1,89
              </div>
              <div className="text-center">
                nnb
              </div>
            </>
          ))
        }
      </div> */}
    </>

  )
}

function HeaderIcon() {
  return (
    <div className="flex flex-col">
      <div className="text-blue-500 bg-slate-100 font-bold rounded-full flex h-10 w-10 items-center justify-center ml-auto">
        <LocalFireDepartmentIcon />
      </div>
      <div className="bg-slate-300 px-3 py-[0.5] rounded-full ml-auto">
        gas
      </div>
    </div>
  )
}
type EnergyPrice = {
  name: string,
  electricity_price: number,
  gas_price: number,
  total_price: number,
}
const energyPrices: EnergyPrice[] = [
  { name: "Budget Energie", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Vattenfall", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Essent", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Eneco", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Van de Bron", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Budget Energie", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Vattenfall", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Essent", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Eneco", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Van de Bron", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Budget Energie", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Vattenfall", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Essent", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Eneco", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Van de Bron", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Budget Energie", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Vattenfall", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Essent", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Eneco", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Van de Bron", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Budget Energie", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Vattenfall", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Essent", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Eneco", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Van de Bron", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Budget Energie", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Vattenfall", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Essent", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Eneco", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Van de Bron", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Budget Energie", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Vattenfall", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Essent", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Eneco", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Van de Bron", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Budget Energie", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Vattenfall", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Essent", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Eneco", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Van de Bron", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Budget Energie", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Vattenfall", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Essent", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Eneco", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Van de Bron", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Budget Energie", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Vattenfall", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Essent", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Eneco", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Van de Bron", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Budget Energie", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Vattenfall", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Essent", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Eneco", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Van de Bron", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Budget Energie", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Vattenfall", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Essent", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Eneco", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Van de Bron", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Budget Energie", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Vattenfall", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Essent", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Eneco", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Van de Bron", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Budget Energie", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Vattenfall", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Essent", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Eneco", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Van de Bron", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Budget Energie", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Vattenfall", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Essent", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Eneco", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Van de Bron", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Budget Energie", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Vattenfall", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Essent", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Eneco", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Van de Bron", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Budget Energie", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Vattenfall", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Essent", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Eneco", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Van de Bron", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Budget Energie", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Vattenfall", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Essent", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Eneco", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Van de Bron", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Budget Energie", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Vattenfall", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Essent", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Eneco", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
  { name: "Van de Bron", electricity_price: 0.53, gas_price: 0.6, total_price: 200 },
]


function TheBestTable() {
  return (
    <table className="table-auto">
      <thead>
        <tr className="bg-red-100 sticky top-0 z-1">
          <th className=""></th>
          <th className=""><HeaderIcon /></th>
          <th className=""><HeaderIcon /></th>
          <th className=""><HeaderIcon /></th>
        </tr>
      </thead>
      <tbody>

        {energyPrices.map((energyPrice, index) => {

          const zIndex = index
          return (
            <>
              <tr className={`bg-blue-700 sticky top-20 z-[${zIndex}]`}>
                <td className="text-right px-5 py-2">{energyPrice.name}</td>
              </tr>
              <tr className="">
                <td className="text-right px-5 py-2">{energyPrice.name}</td>

                <td>
                  <div className="flex flex-col">
                    <div className="text-xxs">
                      €/kwh
                    </div>
                    <div>{energyPrice.electricity_price} </div>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col">
                    <div className="text-xxs">
                      €/m³
                    </div>
                    <div>{energyPrice.gas_price} </div>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col">
                    <div className="text-xxs">
                      €/mnd
                    </div>
                    <div>{energyPrice.total_price} </div>
                  </div>
                </td>
              </tr>
            </>
          )
        })}

        <tr className="sticky bottom-0 -translate-y-10 bg-red-100">
          <td colSpan={4} className="text-center h-32"> hello </td>
        </tr>
      </tbody>
    </table>
  )
}

function StickyTable() {

  return (
    <div>
      {energyPrices.map((energyPrice, index) => {

        return (
          <div className="">
            <div className="sticky top-0 bg-red-600">{`${index} ${energyPrice.name}`}</div>
            <div className="flex flex-row">
              <div>
                {energyPrice.electricity_price}
              </div>
              <div>
                {energyPrice.gas_price}
              </div>
              <div>
                {energyPrice.total_price}
              </div>
            </div>
          </div>
        )
      })}

    </div>
  )
}
function TailWindTable() {
  // https://flowbite.com/docs/components/tables/
  const [sortGas, setSortGas] = useState(false)

  const [sortedPrices, setSortedPrices] = useState(prices)
  useEffect(() => {
    console.log(sortGas)
    if (sortGas) {
      setSortedPrices(prev => prev.sort((a, b) => a.gas - b.gas))
    }

  }, [sortGas])

  return (<>

    <div className="relative overflow-x-auto shadow-md md:rounded-xl select-none">
      <table className="w-full text-left text-gray-500">
        <thead className="text-xs text-gray-700 bg-gray-50 ">
          <tr>
            <th scope="col" className="px-0 py-3">
            </th>
            <th scope="col" className="px-0 py-3">
              G
              <button onClick={() => setSortGas(prev => !prev)}>
                sort
              </button>
            </th>
            <th scope="col" className="px-0 py-3">
              S
            </th>
            <th scope="col" className="px-0 py-3">
              M
            </th>
          </tr>
        </thead>
        <tbody className="text-xs">

          {
            sortedPrices.map(price => (
              <tr className="border-b odd:bg-white even:bg-gray-50">
                <td scope="col">
                  € {price.naam}
                </td>
                <th className="px-0 py-1">
                  {price.naam}
                </th>
                <td className="px-0 py-1">
                  € {price.gas}
                </td>
                <td className="px-0 py-1">
                  € 1,89
                </td>
                <td className="px-0 py-1">
                  € 240
                </td>
              </tr>
            ))
          }

        </tbody>
      </table>
    </div>
  </>
  )
}


const IOSSlider = styled(Slider)(({ theme }) => ({
  color: '#ffffff',
}))

function App() {
  const [gasUse, setGasUse] = useState(1000)
  const [electricityUse, setElectricityUse] = useState(2000)

  return (
    <div className="bg-gray-900 text-gray-50">
      {/* <div className="inline-block">
      <div className="bg-red-200">short </div>
      <div className="bg-blue-200">way longer word with more text</div>
      <div className="grid grid-flow-row grid-cols-4 bg-blue-200">
      <div>hi</div>
      <div>hi</div>
      <div>hi</div>
      <div>hi</div>
      
      </div>
      <div className="grid grid-flow-row-dense grid-cols-4 bg-blue-200">
      <div>hello</div>
      <div>way long hello than the rest</div>
      <div>hello</div>
      <div>hello</div>
      <div>hello</div>
      <div>hello</div>
      <div>hello</div>
      <div>hello</div>
      <div>hello</div>
      <div>hello</div>
      <div>hello</div>
      <div>hello</div>
      <div>hello</div>
      </div>
      <div className="text-center bg-blue-200">Your slider here</div>

    </div> */}
      {/* <div className="overflow-y-scroll h-screen ml-auto">
        <TheBestTable />
      </div> */}
      <StickyTable />
      {/* <div className="bg-white font-['Helvetica']">
      <div className="h-screen flex flex-col w-full md:w-1/3 m-auto">

        <div className="bg-white rounded-3xl p-5">
          <TailwindTableSimple />
        </div>
        <div className="w-full h-1/6 absolute bottom-0 bg-white"> </div>
        <div className="w-full h-2/6 absolute bottom-0 bg-white blur-xl"> </div>
        <div className="w-full h-1/6 md:w-3/12 fixed bottom-0 left-0 transform md:-translate-x-1/2 -translate-y-10 rounded-2xl p-3 bg-black text-white">
          <div className="flex flex-row">

            <div> {gasUse} </div>

            <div className="w-1/2">
              <IOSSlider
                size="small"
                value={gasUse}
                // setValue={() => setGasUse(50)}
                aria-label="Small"
                valueLabelDisplay="auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div> */}
    </div>

  );
}

export default App;
