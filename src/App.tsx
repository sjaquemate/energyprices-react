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

interface Column {
  id: 'naam' | 'elek' | 'gas' | 'maand' | 'energieLabel';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string | JSX.Element;
}

const columns: readonly Column[] = [
  { id: 'naam', label: '', minWidth: 0 },
  {
    id: 'gas',
    label: 'gas',
    minWidth: 0,
    align: 'right',
    format: (value: number) => (<div className="italic"> {value.toFixed(2)} </div>),
  },
  {
    id: 'elek',
    label: 'stroom',
    minWidth: 0,
    align: 'right',
    format: (value: number) => (<div className="italic"> {value.toFixed(2)} </div>),
  },
  {
    id: 'maand', label: 'maand', minWidth: 0, align: 'right',
    format: (value: number) => `€ ${value.toFixed(0)}`
  },
  {
    id: 'energieLabel', label: 'duurzaam', minWidth: 0, align: 'right',
    format: (value: number) => <div className="font-bold text-green-600">{value.toFixed(1)}</div>
  },
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
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
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
                          {column.format && typeof value === 'number'
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
    <div className="w-full md:w-1/2 h-screen flex flex-col p-5 mx-auto">
      <div className="">
        <StickyHeadTable rows={rows} />
      </div>
      <div className="p-5">
        <div className="text-xl font-bold text-center uppercase text-green-500">bereken je tarief </div>
        <div className="flex flex-row gap-5 mt-5">

          <TextField
            variant="standard"
            label="postcode"
            size="small"
            disabled
            value="9712JG"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeIcon />
                </InputAdornment>
              ),
            }}

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
              endAdornment: <InputAdornment position="end"><div className="text-xs"></div></InputAdornment>
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
              endAdornment: <InputAdornment position="end"><div></div></InputAdornment> // m³
            }}

          />
        </div>
      </div>
    </div>
  )
}
