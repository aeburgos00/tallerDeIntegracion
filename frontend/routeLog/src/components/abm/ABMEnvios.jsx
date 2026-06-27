import {
  TextField,
  Box,
  InputAdornment,
  Grid,
  Autocomplete,
  IconButton,
  Snackbar,
  Alert
} from "@mui/material";

import AddIcon from '@mui/icons-material/AddCircleOutlined';

import { useEffect, useState } from "react";

import FormularioABM from "../../layouts/FormularioABM";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import "dayjs/locale/es";

dayjs.extend(customParseFormat)

import ABMClientes from "./ABMClientes.jsx"

import {
  obtenerLocalidadesActivas,
  obtenerTransportistasActivos,
  obtenerEnvioPorId,
  obtenerClientes,
  obtenerDireccionesPorClienteLocalidad,
  obtenerTarifasPorTransportistaLocalidad,
  obtenerEstados,
  crearEnvio,
  modificarEnvio
} from "../../services/api";

export default function ABMEnvios({
  open,
  onClose,
  idEnvio,
  onSuccess
}) {
  ///VARIABLES
  const [clientes, setClientes] = useState([])
  const [localidades, setLocalidades] = useState([])
  const [transportistas, setTransportistas] = useState([])
  const [direcciones, setDirecciones] = useState([])
  const [tarifa, setTarifa] = useState([])
  const [estados, setEstados] = useState([])

  const [openABMCliente, setOpenABMCliente] = useState(false)

  const [formulario, setFormulario] = useState({
    id_cliente: null,
    direccion: null,
    id_localidad: "",
    id_transportista: "",
    fecha_envio: null,
    id_tarifa: null,
    id_estado: 1
  })

  const formularioInicial = {
    id_cliente: null,
    direccion: null,
    id_localidad: "",
    id_transportista: "",
    fecha_envio: null,
    id_tarifa: "",
    id_estado: null
  }

  const estadoSeleccionado =
    estados.find(
      e => e.id === formulario.id_estado
    ) ?? null;

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);
  const [guardando, setGuardando] = useState(false)

  const [mensajeCliente, setMensajeCliente] = useState("")
  const [tipoMensajeCliente, setTipoMensajeCliente] = useState("success")
  const [refreshCliente, setRefreshCliente] = useState(0)

  ///FUNCIONES
  const validarFormulario = () => {
    const hoy = dayjs().startOf("day");
    if (!formulario.id_cliente) {
      return "Debe seleccionar un cliente";
    }
    if (!formulario.id_localidad) {
      return "Debe seleccionar una localidad";
    }
    if (!formulario.direccion?.trim()) {
      return "Debe ingresar una dirección";
    }
    if (!formulario.id_transportista) {
      return 'Debe seleccionar un transportista';
    }
    if (!formulario.fecha_envio) {
      return 'Debe seleccionar una fecha';
    }
    if (formulario.fecha_envio.isBefore(hoy)) {
      return "La fecha de envío no puede ser anterior a hoy";
    }
    if (!formulario.id_estado) {
      return "Debe seleccionar un estado";
    }
    return null;
  };

  const handleGuardar = async () => {
    const errorValidacion = validarFormulario();

    if (errorValidacion) {
      setMensaje(errorValidacion);
      setError(true);
      return;
    }

    try {
      setGuardando(true)
      if (!idEnvio) {
        await crearEnvio(formulario)
        onSuccess("Envío creado correctamente")
      } else {
        await modificarEnvio(
          idEnvio,
          formulario
        )
        onSuccess("Envío modificado correctamente")
      }
      setError(false);
      limpiarFormulario();
      onClose();
    } catch (error) {
      setMensaje(
        error?.message || "Ocurrió un error al guardar"
      );
      setError(true);
    } finally {
      setGuardando(false)
    }
  }

  const limpiarFormulario = () => {
    setFormulario(formularioInicial)
  }

  const handleClose = () => {
    limpiarFormulario()
    onClose()
  }

  ///USE EFFECTS
  useEffect(() => {
    const cargarCombos = async () => {
      try {
        const clientesResp = await obtenerClientes()
        const localidadesResp = await obtenerLocalidadesActivas()
        const transportistasResp = await obtenerTransportistasActivos()
        const estadosResp = await obtenerEstados()
        setClientes(clientesResp.data)
        setLocalidades(localidadesResp.data)
        setTransportistas(transportistasResp.data)
        setEstados(estadosResp.data)
      } catch (error) {
        console.error(error)
      }
    }
    cargarCombos()
  }, [])

  useEffect(() => {
    const recargarClientes = async () => {
      try {
        const clientesResp = await obtenerClientes()
        setClientes(clientesResp.data)
      } catch (error) {
        console.error(error)
      }
    }
    recargarClientes()
  }, [refreshCliente])

  useEffect(() => {
    if (!idEnvio) {
      const timeout = setTimeout(() => {
        setFormulario({
          id_cliente: null,
          direccion: null,
          id_localidad: "",
          id_transportista: "",
          fecha_envio: null,
          id_tarifa: null,
          id_estado: null
        });
      }, 0);
      return () => clearTimeout(timeout);
    }

    let cancelled = false;

    const cargarEnvio = async () => {
      try {
        const response = await obtenerEnvioPorId(idEnvio)
        const envio = response.data
        if (cancelled) return;
        setFormulario({
          id_cliente: envio.id_cliente || "",
          direccion: envio.direccion || "",
          id_localidad: envio.id_localidad || "",
          id_transportista: envio.id_transportista || "",
          fecha_envio: envio.fecha_envio
            ? dayjs(envio.fecha_envio, "DD/MM/YYYY")
            : null,
          id_tarifa: envio.id_tarifa || "",
          id_estado: envio.id_estado || ""
        })
      } catch (error) {
        console.error(error)
      }
    }
    cargarEnvio()
    return () => { cancelled = true; };
  }, [idEnvio])

  useEffect(() => {
    if (
      !formulario.id_cliente ||
      !formulario.id_localidad
    )
      return

    const cargarDirecciones = async () => {
      try {
        const response =
          await obtenerDireccionesPorClienteLocalidad(
            formulario.id_cliente,
            formulario.id_localidad
          )
        setDirecciones(response.data ?? [])
      } catch (error) {
        console.error(error)
      }
    }
    cargarDirecciones()
  }, [formulario.id_cliente, formulario.id_localidad])

  useEffect(() => {
    if (
      !formulario.id_transportista ||
      !formulario.id_localidad
    ) {
      const timeout = setTimeout(() => {
        setTarifa(null)
        setFormulario(prev => ({
          ...prev,
          id_tarifa: null
        }))
      }, 0)
      return () => clearTimeout(timeout);
    }

    const cargarTarifa = async () => {
      try {
        const response =
          await obtenerTarifasPorTransportistaLocalidad(
            formulario.id_transportista,
            formulario.id_localidad
          )
        const tarifa = response.data[0]
        setTarifa(tarifa)
        setFormulario(prev => ({
          ...prev,
          id_tarifa: tarifa?.id ?? null
        }))
      } catch (error) {
        console.error(error)
      }
    }
    cargarTarifa()
  }, [formulario.id_transportista, formulario.id_localidad])

  return (
    <FormularioABM
      open={open}
      titulo={
        idEnvio
          ? "Modificar Envío de Paquete"
          : "Nuevo Envío de Paquete"
      }
      onClose={handleClose}
      onSave={handleGuardar}
      loading={guardando}
    >
      <Box component="form">
        <Grid container spacing={2}>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: "flex",
                gap: 1
              }}
            >
              <Autocomplete
                disabled={!!idEnvio}
                fullWidth
                options={clientes}
                value={clientes.find(
                  c => c.id === formulario.id_cliente
                ) ?? null
                }
                getOptionLabel={(option) =>
                  `${option.nombre_apellido} - DNI ${option.dni}`
                }
                isOptionEqualToValue={(option, value) =>
                  option.id === value.id
                }
                onChange={(event, value) => {
                  setFormulario(prev => ({
                    ...prev,
                    id_cliente: value?.id ?? null
                  }))
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
                    label="Cliente"
                  />
                )
                }
              />
              <IconButton
                disabled={!!idEnvio}
                sx={{ color: "#3b82f6" }}
                onClick={() => setOpenABMCliente(true)}
              >
                <AddIcon />
              </IconButton>

              <ABMClientes
                open={openABMCliente}
                onClose={() => setOpenABMCliente(false)}
                onSuccess={(mensajeCliente) => {
                  setMensajeCliente(mensajeCliente)
                  setTipoMensajeCliente("success")
                  setRefreshCliente(prev => prev + 1)
                }}
              />
              <Snackbar
                open={!!mensajeCliente}
                autoHideDuration={4000}
                onClose={() => setMensajeCliente("")}
              >
                <Alert severity={tipoMensajeCliente}>
                  {mensajeCliente}
                </Alert>
              </Snackbar>

            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Autocomplete
              disabled={!!idEnvio}
              fullWidth
              options={localidades}
              value={
                localidades.find(
                  l => l.id === formulario.id_localidad
                ) ?? null
              }
              getOptionLabel={(option) =>
                `${option.nombre}`
              }
              isOptionEqualToValue={(option, value) =>
                option.id === value.id
              }
              onChange={(event, value) => {
                setFormulario(prev => ({
                  ...prev,
                  id_localidad: value?.id ?? null,
                }))
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  required
                  label="Localidad"
                />
              )
              }
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Autocomplete
              disabled={!!idEnvio}
              fullWidth
              freeSolo
              options={
                formulario.id_cliente &&
                  formulario.id_localidad
                  ? direcciones
                  : []
              }
              getOptionLabel={(option) =>
                typeof option === "string"
                  ? option
                  : option.descripcion
              }
              inputValue={formulario.direccion ?? ""}
              value={direcciones.find(
                d => d.descripcion === formulario.direccion
              ) ?? null
              }
              onChange={(event, value) => {
                setFormulario(prev => ({
                  ...prev,
                  direccion: typeof value === "string"
                    ? value
                    : value?.descripcion ?? ""
                }))
              }}
              onInputChange={(event, value, reason) => {
                if (reason === "input") {
                  setFormulario(prev => ({
                    ...prev,
                    direccion: value
                  }))
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  required
                  label="Dirección"
                />
              )
              }
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Autocomplete
              fullWidth
              options={transportistas}
              value={
                transportistas.find(
                  t => t.id === formulario.id_transportista
                ) ?? null
              }
              getOptionLabel={(option) =>
                `${option.nombre} - Usuario: ${option.usuario}`
              }
              isOptionEqualToValue={(option, value) =>
                option.id === value.id
              }
              onChange={(event, value) => {
                setFormulario(prev => ({
                  ...prev,
                  id_transportista: value?.id ?? null
                }))
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  required
                  label="Transportista"
                />
              )
              }
            />
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
              value={Number(tarifa?.precio || 0).toLocaleString("es-AR")}
            />
          </Grid>

          {idEnvio && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Autocomplete
                fullWidth
                options={estados}
                value={estadoSeleccionado}
                getOptionLabel={(option) =>
                  `${option.descripcion}`
                }
                isOptionEqualToValue={(option, value) =>
                  option.id === value.id
                }
                onChange={(event, value) => {
                  setFormulario(prev => ({
                    ...prev,
                    id_estado: value?.id ?? null
                  }))
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
                    label="Estado"
                  />
                )
                }
              />
            </Grid>
          )}

        </Grid>
      </Box>

      <Snackbar
        open={!!mensaje}
        autoHideDuration={4000}
        onClose={() => setMensaje("")}
      >
        <Alert
          severity={error ? "error" : "success"}
        >
          {mensaje}
        </Alert>
      </Snackbar>

    </FormularioABM>

  )
}
