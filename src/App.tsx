import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { LocalFireDepartment, VolumeDown, VolumeUp } from '@mui/icons-material';
import BoltIcon from '@mui/icons-material/Bolt';
import HomeIcon from '@mui/icons-material/Home';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';

interface Column {
  id: 'naam' | 'elek' | 'gas' | 'maand';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string | JSX.Element;
}

const columns: readonly Column[] = [
  { id: 'naam', label: '', minWidth: 0 },
  { id: 'elek', label: 'stroom', minWidth: 0 },
  {
    id: 'gas',
    label: 'gas',
    minWidth: 0,
    align: 'right',
    format: (value: number) => (<div> {value.toLocaleString('en-US')} </div>),
  },
  { id: 'maand', label: 'maand', minWidth: 0,
    format: (value: number) => `€ ${value.toFixed(0)}` },
];

interface Data {
  naam: string;
  elek: number;
  gas: number;
  maand: number;
}

function createData(
  naam: string,
  elek: number,
  gas: number,
  base: number,
): Data {
  const maand = (elek*2500 + gas* 1000 + base)/12 
  return { naam, elek, gas, maand };
}

const rows = [
  createData('Budget Energie', 1.32, 2.5, -200),
  createData('Vattenfall', 1.32, 2.5, -200),
  createData('Engie', 1.32, 2.5, -200),
  createData('Frank', 1.32, 2.5, -200),
  createData('Budget Energie Plus', 1.32, 2.5, -200),
  createData('Budget Energie', 1.32, 2.5, -200),
  createData('Budget Energie', 1.32, 2.5, -200),
];

function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(4);

  const firstRowRef = useRef(null) as any

  const setRowsPerPageBasedOnScreenHeight = () => {
    const screenHeight = window.innerHeight
    const rowHeight = firstRowRef.current?.clientHeight
    const ratioRowScreen = rowHeight / screenHeight
    console.log(ratioRowScreen)
    const maxRowsPerPage = Math.floor(0.65 / ratioRowScreen)
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
  return (
    <div className="w-full md:w-1/2 h-screen flex flex-col p-5 mx-auto">
      <div className="mx-auto">
        <StickyHeadTable />
      </div>
      <div className="mt-5 p-5 b-5">
        <div className="text-xl font-bold text-center uppercase text-green-500">bereken je tarief </div>
        <div className="w-1/2 mt-5">

        </div>
        <div className="flex flex-row gap-5 mt-5">

        <TextField
          variant="standard"
          label="postcode"
          size="small"
          defaultValue="1234AB"
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
            defaultValue="2,500"
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
            defaultValue="1,000"
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
