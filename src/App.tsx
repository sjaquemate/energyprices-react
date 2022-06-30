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
import { LensTwoTone, LocalFireDepartment, VolumeDown, VolumeUp } from '@mui/icons-material';
import BoltIcon from '@mui/icons-material/Bolt';
import HomeIcon from '@mui/icons-material/Home';
import Stack from '@mui/material/Stack';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import Slider from '@mui/material/Slider';
import prices from './data/prices.json'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CreateIcon from '@mui/icons-material/Create';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SpaceBarIcon from '@mui/icons-material/SpaceBar';
import { OverOnsDialog } from './components/OverOnsDialog';

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

interface Data {
  naam: { naam: string, url: string }
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
  url: string,
  electrictyUsage: number,
  gasUsage: number,
): Data {
  const maand = (elek * electrictyUsage + gas * gasUsage + base) / 12
  return { naam: { naam: naam, url: url }, elek: elek, gas: gas, maand: maand, energieLabel: energieLabel };
}

// const rows = [
//   createData('Vattenfall', 0.7, 2.5, -200),
// ];

interface StickyHeadTableProps {
  rows: Data[],
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

  useLayoutEffect(() => {
    setRowsPerPageBasedOnScreenHeight()
  }, [])
  useLayoutEffect(() => {
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
        newSortedStates[num] = newSortedStates[num] === "down" ? "up" : "down"
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
        <div className="text-xs italic">€/maand</div>
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
          <div className="text-xs italic">€/m³</div>
        </div>
      ),
      minWidth: 0,
      // align: 'right',
      format: (value: number) => (<div className="italic text-center py-2"> {value.toFixed(2)} </div>),
    },
    {
      id: 'elek',
      label: <div className="flex flex-col text-center">
        <SortingArrowButton sortedState={sortedStates[2]} onClick={() => flipSortedState(2)} />

        <div>stroom</div>
        <div className="text-xs italic">€/kWh</div>
      </div>,
      minWidth: 0,
      // align: 'right',
      format: (value: number) => (<div className="italic text-center whitespace-nowrap">{value.toFixed(2)} </div>),
    },
    // {
    //   id: 'energieLabel', label: 'stroom', minWidth: 0,
    //   format: (value: number) => <div className="text-green-600 text-center italic">{value.toFixed(1)}</div>
    // },
  ];


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
                const rowRef = index === 0 ? firstRowRef : undefined
                // const colors = ["bg-teal-50", "bg-teal-100", "bg-teal-200", "bg-teal-300", "bg-teal-400", "bg-teal-500"]
                // const color = colors[Math.floor(index / 2) % 6]
                const color = "bg-white"
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index} ref={rowRef} className={color}>
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

  const [postcode, setPostcode] = useState("9712JG")
  const [isValidPostcode, setIsValidPostcode] = useState(true)
  const [electricityUsage, setElectricityUsage] = useState(2500)
  const [gasUsage, setGasUsage] = useState(1200)

  useEffect( () => {
    const expr = new RegExp("^[0-9]{4} ?[a-zA-Z]{2}$")
    const isValid = expr.test(postcode)
    setIsValidPostcode(isValid)
  }, [postcode])
  const [rows, setRows] = useState<Data[]>(prices.map(price => (
    createData(price.naam, price.price_electricity, price.price_gas, price.costs_base, price.energielabel, price.url, electricityUsage, gasUsage))
  ))

  useEffect(() => {
    setRows(
      prices.map(price =>
        createData(price.naam, price.price_electricity, price.price_gas, price.costs_base, price.energielabel, price.url, electricityUsage, gasUsage)
      ))
  }, [gasUsage, electricityUsage])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const openDialog = () => setIsDialogOpen(true)
  const closeDialog = () => setIsDialogOpen(false)

  return (
    <div className="">

      <ThemeProvider theme={theme}>
        <OverOnsDialog isOpen={isDialogOpen} closeDialog={closeDialog} />
        <div className="bg-teal-50">

          <div className="w-full xl:w-1/2 md:w-2/3 mx-auto bg-teal-800 py-2">
            <div className="flex flex-row justify-center text-teal-100 gap-2 text-xs md:text-md">

              <div>
                variabele energietarieven op een eerlijke manier

              </div>
              <div className="underline cursor-pointer" onClick={openDialog}> over ons </div>
            </div>
          </div>
          <div className="w-full xl:w-1/2 md:w-2/3 h-screen flex flex-col mx-auto bg-teal-500 gap-4 py-4 px-2 ">
            {/* <div className="flex items-center gap-2 ml-5"> */}
            {/* <div className="text-xl font-bold text-center text-teal-900 ml-6 ">variabeltarief.com</div> */}
            <div className="text-xl font-bold text-left text-teal-50 ml-6">verbruik</div>
            {/* <div className="text-2xl text-white "><CreateIcon fontSize='inherit'/></div> */}

            {/* </div> */}
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
            <div className="flex justify-between items-baseline ">
              {/* <div className="text-xl font-bold text-left ml-6 text-neutral-100"> Aanbod </div> */}
              <div className="text-xl font-bold text-left ml-6 text-teal-50"> aanbod </div>
              <div className="text-teal-50 text-xs m-0">laatst geüpdate 29 juni 2022</div>
            </div>

            <div className="">
              <StickyHeadTable rows={rows} />
            </div>
          </div>
        </div>
      </ThemeProvider>
    </div>
  )
}
