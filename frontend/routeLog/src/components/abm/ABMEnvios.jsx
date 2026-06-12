import {
  TextField,
  Box,
  InputAdornment,
  Grid
} from "@mui/material";

import FormularioABM from "../../layouts/FormularioABM";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import "dayjs/locale/es";

export default function ABMEnvios({
  open,
  onClose,
  title
}) {
  const handleGuardar = () => {
    console.log("Guardar envío")
  }
  return (
    <FormularioABM
      open={open}
      titulo={title}
      onClose={onClose}
      onSave={handleGuardar}
    >
      <Box component="form">
        <Grid container spacing={2}>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth required label="Cliente" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth required label="Dirección" />
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth required label="Localidad" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth required label="Transportista" />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
              required
              label="Fecha Envío *"
              format="DD/MM/YYYY"
              sx={{width: '100%'}}
            />
            </LocalizationProvider>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField 
            disabled 
            fullWidth
            variant="filled"
            slotProps={{
              input: {
                readOnly: true,
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              },
            }}
            label="Tarifa"
            />
          </Grid>
          

        </Grid>
      </Box>
      
    </FormularioABM>
  )
}