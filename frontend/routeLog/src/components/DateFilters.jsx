import { Box } from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import useDateFilter from '../hooks/useDateFilter'

export default function DateFilters() {

  const {
    fechaDesde,
    fechaHasta,
    setFechaDesde,
    setFechaHasta
  } = useDateFilter()

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          display: "flex",
          gap: 1
        }}
      >
        <DatePicker
          label="Desde"
          value={fechaDesde}
          onChange={setFechaDesde}
          slotProps={{
            textField: {
              size: "small"
            }
          }}
          sx={{width:180}}
        />

        <DatePicker
          label="Hasta"
          value={fechaHasta}
          onChange={setFechaHasta}
          slotProps={{
            textField: {
              size: "small"
            }
          }}
          sx={{width:180}}
        />
      </Box>
    </LocalizationProvider>
  );
}