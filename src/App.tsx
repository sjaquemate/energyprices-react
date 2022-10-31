import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import Stack from '@mui/material/Stack';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import Slider from '@mui/material/Slider';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CreateIcon from '@mui/icons-material/Create';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SpaceBarIcon from '@mui/icons-material/SpaceBar';
import { OverOnsDialog } from './components/OverOnsDialog';
import { GegevensEditor } from './GegevensEditor';
import { Scrollbars } from 'react-custom-scrollbars';

type SortedState = "up" | "down" | null

const SortingArrowButton = ({ sortedState, onClick }: { sortedState: SortedState, onClick: () => void }) => {

  let icon = <div className="opacity-20"><ArrowUpwardIcon fontSize='inherit' /></div>
  if (sortedState === "up") {
    icon = <ArrowUpwardIcon fontSize='inherit' />
  }
  if (sortedState === "down") {
    icon = <ArrowDownwardIcon fontSize='inherit' />
  }
  return (
    <div className="text-md cursor-pointer" onClick={onClick} >
      {
        icon
      }
    </div>
  )
}
interface Column {
  id: 'naam' | 'elek' | 'gas' | 'maand' | 'energieLabel';
  label: string | JSX.Element;
  minWidth?: number;
  align?: 'left';
  format?: (obj: any) => string | JSX.Element;
}

export interface Data {
  naam: { naam: string, url: string }
  elek: number
  gas: number
  maand: number
  energieLabel: number | null
}

interface StickyHeadTableProps {
  rows: Data[],
}
const StickyHeadTable = ({ rows }: StickyHeadTableProps) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);

  const tableRef = useRef(null) as any
  const firstRowRef = useRef(null) as any

  const [sortedRows, setSortedRows] = useState(rows)

  useEffect(() => {
    setSortedRows(rows)
    // sort on maand again
    setSortedStates(["up", null, null])
    sortRows("maand", "up")
  }, [rows])

  const sortRows = (sortKey: "maand" | "gas" | "elek", order: "down" | "up") => {
    console.log(sortKey, order)
    setSortedRows(prevRows =>
      [...prevRows].sort((a, b) => order === "up" ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey])
    )
  }

  const [sortedStates, setSortedStates] = useState<SortedState[]>(["up", null, null])

  const flipSortedState = (num: number) => {
    setSortedStates(prevSortedStates => {
      let newSortedStates = [...prevSortedStates]
      // set current active 
      if (newSortedStates[num] === null) {
        newSortedStates[num] = "up"
      }
      else {
        // newSortedStates[num] = newSortedStates[num] === "down" ? "up" : "down"
        newSortedStates[num] = "up"
      }
      // deactivate rest
      newSortedStates = newSortedStates.map((sortedState, index) => (
        index === num ? sortedState : null
      ))
      return newSortedStates
    })
  }

  useEffect(() => {
    if (sortedStates[0] !== null) {
      sortRows("maand", sortedStates[0])
      // return 
    }
    if (sortedStates[1] !== null) {
      sortRows("gas", sortedStates[1])
      // return 
    }
    if (sortedStates[2] !== null) {
      sortRows("elek", sortedStates[2])
      // return 
    }
  }, [sortedStates])

  const columns: Column[] = [
    {
      id: 'naam', label: '', minWidth: 0,
      format: (obj: { naam: string, url: string }) => (

        <div className="ml-5 flex flex-row justify-left items-baseline align-top gap-1  
        cursor-pointer
        transition duration-200 hover:translate-x-1 hover:text-teal-800 hover:font-bold delay-50"
          onClick={() => window.open(obj.url)}>
          <div className="whitespace-nowrap">{obj.naam} </div>
          <div className="text-xl font-bold">
            <ChevronRightIcon fontSize="inherit" />
          </div>
        </div>
      )
    },
    {
      id: 'maand',
      label: <div className="flex flex-col text-center ">
        <SortingArrowButton sortedState={sortedStates[0]} onClick={() => flipSortedState(0)} />
        <div>kosten</div>
        <div className="text-xs">€/maand</div>
      </div>,
      minWidth: 0,
      // align: 'right',
      format: (value: number) => (<div className="text-center text-teal-700 font-bold whitespace-nowrap">{`€ ${value.toFixed(0)},-`}</div>)
    },
    {
      id: 'gas',
      label: (
        <div className="flex flex-col text-center">
          {/* <SortableArrow /> */}
          <SortingArrowButton sortedState={sortedStates[1]} onClick={() => flipSortedState(1)} />
          <div>gas</div>
          <div className="text-xs">€/m³</div>
        </div>
      ),
      minWidth: 0,
      // align: 'right',
      format: (value: number) => (<div className="text-center py-2"> {value.toFixed(2)} </div>),
    },
    {
      id: 'elek',
      label: <div className="flex flex-col text-center">
        <SortingArrowButton sortedState={sortedStates[2]} onClick={() => flipSortedState(2)} />

        <div>stroom</div>
        <div className="text-xs">€/kWh</div>
      </div>,
      minWidth: 0,
      // align: 'right',
      format: (value: number) => (<div className="text-center whitespace-nowrap">{value.toFixed(2)} </div>),
    },
    // {
    //   id: 'energieLabel', label: 'stroom', minWidth: 0,
    //   format: (value: number) => <div className="text-green-600 text-center italic">{value.toFixed(1)}</div>
    // },
  ];


  return (
    <Paper sx={{ width: '100%' }}>
      <TableContainer sx={{}} ref={tableRef}>
        <Table stickyHeader size="small" aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  padding="checkbox"
                // style={{ minWidth: 0, paddingLeft: "0rem", paddingRight: "0rem", margin: 0}}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                // const colors = ["bg-teal-50", "bg-teal-100", "bg-teal-200", "bg-teal-300", "bg-teal-400", "bg-teal-500"]
                // const color = colors[Math.floor(index / 2) % 6]
                const color = "bg-white"
                const ref = (index === 0) ? firstRowRef : undefined
                return (
                  <TableRow hover role="checkbox" ref={ref} tabIndex={-1} key={index} className={color}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell padding='none' key={column.id} align={column.align}>
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
    </Paper>
  );
}


const theme = createTheme({
  palette: {
    primary: {
      light: '#fff',
      main: '#fff',
      dark: '#fff',
      contrastText: '#fff',
    },
    secondary: {
      light: '#fff',
      main: '#fff',
      dark: '#fff',
      contrastText: '#fff',
    },
  },
});

export default function App() {

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const openDialog = () => setIsDialogOpen(true)
  const closeDialog = () => setIsDialogOpen(false)

  const [rows, setRows] = useState<Data[]>()

  return (
    <div className="relative">

      <ThemeProvider theme={theme}>
        <OverOnsDialog isOpen={isDialogOpen} closeDialog={closeDialog} />
        <div className="bg-neutral-200">
          <div className="flex w-full xl:w-1/2 md:w-2/3 h-screen flex flex-col mx-auto bg-teal-500 gap-4">

            <div className="flex flex-row justify-center text-teal-100 gap-2 text-xs md:text-md bg-teal-700 py-2">
              <div>
                variabele energietarieven op een eerlijke manier
              </div>
              <div className="underline cursor-pointer" onClick={openDialog}> over ons </div>
            </div>
            <div className="mx-6 ">
              <div className="w-full flex justify-end text-right">
                <div className="flex flex-col ">
                  <div className="flex items-baseline font-bold text-teal-50">
                    <div className="text-[2.5rem]">v</div>
                    <div className="text-[2rem]">ariabeltarief.com</div>
                  </div>
                </div>
              </div>
              <div className="flex text-teal-100 justify-end text-right">
                <div className="text-[1rem]">transparante energietarieven op een eerlijke manier</div>
              </div>
            </div>
            <div className="text-teal-100 text-xs text-left mx-6">laatst geüpdate 29 juni 2022</div>
            <div className="flex-grow px-6 h-0 overflow-y-scroll">
              {rows && <StickyHeadTable rows={rows} />}
            </div>
            <div className="flex-none">
              <GegevensEditor setRows={setRows} />
            </div>
          </div>
        </div>
      </ThemeProvider>
    </div>
  )
}
