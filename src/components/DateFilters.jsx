import * as React from "react";

import { Box} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function DateFilters() {

  const [fechaDesde, setFechaDesde] = React.useState(null);
  const [fechaHasta, setFechaHasta] = React.useState(null);

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
          onChange={(newValue) => setFechaDesde(newValue)}
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
          onChange={(newValue) => setFechaHasta(newValue)}
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