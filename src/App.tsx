import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { LocalFireDepartment, VolumeDown, VolumeUp } from '@mui/icons-material';
import BoltIcon from '@mui/icons-material/Bolt';
import HomeIcon from '@mui/icons-material/Home';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import prices from './data/prices.json'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface Column {
  id: 'naam' | 'elek' | 'gas' | 'maand' | 'energieLabel';
  label: string | JSX.Element;
  minWidth?: number;
  align?: 'right';
  format?: (value: number | string) => string | JSX.Element;
}

const columns: readonly Column[] = [
  { id: 'naam', label: '', minWidth: 0,
  format: (value: number | string) => (<div className="flex flex-row justify-left"> <div>{value}</div> <div className="text-xl transition hover:translate-x-1"><ChevronRightIcon fontSize="inherit"/></div></div>) 
},
  {
    id: 'gas',
    label: <div className="flex flex-col">
      <div>gas</div>
      <div className="text-xs italic">€/m³</div>
      </div>,
    minWidth: 0,
    align: 'right',
    format: (value: number | string) => (<div className="italic"> {typeof value === "number" ? value.toFixed(2) : value} </div>),
  },
  {
    id: 'elek',
    label:  <div className="flex flex-col">
    <div>stroom</div>
    <div className="text-xs italic">€/kWh</div>
    </div>,
    minWidth: 0,
    align: 'right',
    format: (value: number | string) => (<div className="italic"> {typeof value === "number" ? value.toFixed(2) : value} </div>),
  },
  {
    id: 'maand', 
    label: <div className="flex flex-col">
    <div>kosten</div>
    <div className="text-xs italic">e/maand</div>
    </div>, 
    minWidth: 0, align: 'right',
    format: (value: number | string) => `€ ${typeof value === "number" ? value.toFixed(0) : value}`
  },
  // {
  //   id: 'energieLabel', label: 'duurzaam', minWidth: 0, align: 'right',
  //   format: (value: number) => <div className="font-bold text-green-600">{value.toFixed(1)}</div>
  // },
];

interface Data {
  naam: string
  elek: number
  gas: number
  maand: number
  energieLabel: number | null
}

function createData(
  naam: string,
  elek: number,
  gas: number,
  base: number,
  energieLabel: number | null,
  electrictyUsage: number,
  gasUsage: number,
): Data {
  const maand = (elek * electrictyUsage + gas * gasUsage + base) / 12
  return { naam: naam, elek: elek, gas: gas, maand: maand, energieLabel: energieLabel };
}

// const rows = [
//   createData('Vattenfall', 0.7, 2.5, -200),
// ];

interface StickyHeadTableProps {
  rows: Data[]
}
const StickyHeadTable = ({ rows }: StickyHeadTableProps) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(4);

  const firstRowRef = useRef(null) as any

  const setRowsPerPageBasedOnScreenHeight = () => {
    const screenHeight = window.innerHeight
    const rowHeight = firstRowRef.current?.clientHeight
    const ratioRowScreen = rowHeight / screenHeight
    console.log(ratioRowScreen)
    const maxRowsPerPage = Math.floor(0.55 / ratioRowScreen)
    setRowsPerPage(isNaN(maxRowsPerPage) || maxRowsPerPage === 0 ? 1 : maxRowsPerPage)
  }

  useEffect(() => {
    setRowsPerPageBasedOnScreenHeight()
  })
  useEffect(() => {
    window.addEventListener("resize", () => {
      setRowsPerPageBasedOnScreenHeight()
    });
    return () => {
      window.removeEventListener("resize", () => {
        setRowsPerPageBasedOnScreenHeight()
      })
    }
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: '80vh' }}>
        <Table stickyHeader size="small" aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: 0, paddingLeft: "0rem", paddingRight: "0rem", flexWrap: "nowrap" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const rowRef = index === 0 ? firstRowRef : undefined
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index} ref={rowRef}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && (value !== null)
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination

        rowsPerPageOptions={[]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default function App() {

  const [electricityUsage, setElectricityUsage] = useState(2500)
  const [gasUsage, setGasUsage] = useState(1200)

  const rows = prices.map(price => (
    createData(price.naam, price.price_electricity, price.price_gas, price.costs_base, price.energielabel, electricityUsage, gasUsage)
  )).sort((a, b) => a.maand - b.maand).map((data, index) => ({ ...data, naam: `${index + 1}. ${data.naam}` }))

  return (
    <div className="w-full md:w-1/2 h-screen flex flex-col p-2 mx-auto">

      <div className="">
        <div className="text-xl font-bold text-left lowercase ml-5 text-neutral-600">verbruik  </div>
        <div className="gap-5 mt-5 grid grid-cols-3 w-full">

          <TextField
            variant="standard"
            label="postcode"
            size="small"
            disabled
            value="9712JG"
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
            value={electricityUsage.toString()}
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
      <div className="text-xl font-bold text-left ml-5 lowercase text-neutral-600 mt-5"> aanbod </div>

      <div className="mt-5">
        <StickyHeadTable rows={rows} />
      </div>
    </div>
  )
}
