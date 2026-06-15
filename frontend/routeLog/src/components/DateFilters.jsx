import { Box } from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import useDateFilter from '../hooks/useDateFilter'

import "dayjs/locale/es";

export default function DateFilters() {

  const {
    fechaDesde,
    fechaHasta,
    setFechaDesde,
    setFechaHasta
  } = useDateFilter()

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
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
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              size: "small"
            }
          }}
          sx={{
            width: {
              xs: 100,
              sm: 140,
              md: 180
            }
          }}
        />

        <DatePicker
          label="Hasta"
          value={fechaHasta}
          onChange={setFechaHasta}
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              size: "small"
            }
          }}
          sx={{
            width: {
              xs: 100,
              sm: 140,
              md: 180
            }
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}