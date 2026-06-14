import {
  TextField,
  Box,
  InputAdornment,
  Grid,
  MenuItem
} from "@mui/material";

import { useEffect, useState } from "react";

import FormularioABM from "../../layouts/FormularioABM";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import "dayjs/locale/es";

dayjs.extend(customParseFormat)

import {
  obtenerLocalidadesActivas,
  obtenerTransportistasActivos,
  obtenerEnvioPorId
} from "../../services/api";



export default function ABMEnvios({
  open,
  onClose,
  idEnvio
}) {
  const handleGuardar = async () => {
    // try {
    //   if(idEnvio){
    //     await modificarEnvio(
    //       idEnvio,
    //       formulario
    //     )
    //   } else {
    //     await crearEnvio(
    //       formulario
    //     )
    //   }
    //   onClose()
    // } catch(error) {
    //   console.error(error)
    // }
    console.log("guardar")
  }
  const [localidades, setLocalidades] = useState([])
  const [transportistas, setTransportistas] = useState([])

  useEffect(() => {
    const cargarCombos = async () => {
      try {
        const localidadesResp = await obtenerLocalidadesActivas()
        const transportistasResp = await obtenerTransportistasActivos()
        setLocalidades(localidadesResp.data)
        setTransportistas(transportistasResp.data)
      } catch (error) {
        console.error(error)
      }
    }
    cargarCombos()
  }, [])


  const handleChange = (campo) => (e) => {
    setFormulario(prev => ({
      ...prev,
      [campo]: e.target.value
    }))
  }

  const [formulario, setFormulario] = useState({
    cliente: "",
    direccion: "",
    id_localidad: null,
    id_transportista: null,
    fecha_envio: null,
    tarifa: ""
  })

  useEffect(() => {

    if (!idEnvio) {
      setFormulario({
        cliente: "",
        direccion: "",
        id_localidad: null,
        id_transportista: null,
        fecha_envio: null,
        tarifa: ""
      });
      return
    }

    const cargarEnvio = async () => {
      try {
        const response = await obtenerEnvioPorId(idEnvio)
        const envio = response.data

        console.log(envio)

        setFormulario({
          cliente: envio.cliente || "",
          direccion: envio.direccion || "",
          id_localidad: envio.id_localidad || "",
          id_transportista: envio.id_transportista || "",
          fecha_envio: envio.fecha_envio
            ? dayjs(envio.fecha_envio, "DD/MM/YYYY")
            : null,
          tarifa: envio.tarifa || ""
        })
      } catch (error) {
        console.error(error)
      }
    }
    cargarEnvio()
  }, [idEnvio])

  return (
    <FormularioABM
      open={open}
      titulo={
        idEnvio
          ? "Modificar Envío de Paquete"
          : "Nuevo Envío de Paquete"
      }
      onClose={onClose}
      onSave={handleGuardar}
    >
      <Box component="form">
        <Grid container spacing={2}>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              label="Cliente"
              value={formulario.cliente}
              onChange={handleChange("cliente")}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              label="Dirección"
              value={formulario.direccion}
              onChange={handleChange("direccion")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              select
              label="Localidad"
              value={formulario.id_localidad}
              onChange={handleChange("id_localidad")}
            >
              {localidades.map((localidad) => (
                <MenuItem
                  key={localidad.id}
                  value={localidad.id}
                >
                  {localidad.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              select
              label="Transportista"
              value={formulario.id_transportista}
              onChange={handleChange("id_transportista")}
            >
              {transportistas.map((transportista) => (
                <MenuItem
                  key={transportista.id}
                  value={transportista.id}
                >
                  {transportista.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                required
                label="Fecha Envío *"
                format="DD/MM/YYYY"
                sx={{ width: '100%' }}
                value={formulario.fecha_envio}
                onChange={(newValue) =>
                  setFormulario({
                    ...formulario,
                    fecha_envio: newValue
                  })
                }
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
              value={formulario.tarifa}
            />
          </Grid>


        </Grid>
      </Box>

    </FormularioABM>
  )
}