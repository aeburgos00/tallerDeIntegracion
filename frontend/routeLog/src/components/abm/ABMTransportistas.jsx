import {
  TextField,
  Box,
  InputAdornment,
  Grid,
  Snackbar,
  Alert,
  MenuItem,
  IconButton
} from "@mui/material";

import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CloseIcon from "@mui/icons-material/Close";

import { useEffect, useState } from "react";

import FormularioABM from "../../layouts/FormularioABM";

import {
  obtenerTransportistaPorId,
  crearTransportista,
  modificarTransportista
} from "../../services/api";

export default function ABMTransportistas({
  open,
  onClose,
  idTransportista,
  onSuccess
}) {
  ///VARIABLES
  const [formulario, setFormulario] = useState({
    usuario: "",
    contraseña: "",
    nombre_apellido: "",
    dni: "",
    correo: "",
    costo_envio: "",
    estado:""
  })

  const formularioInicial = {
    usuario: "",
    contraseña: "",
    nombre_apellido: "",
    dni: "",
    correo: "",
    costo_envio: "",
    estado:""
  }

  const [editarPassword, setEditarPassword] = useState(false);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);
  const [guardando, setGuardando] = useState(false)

  ///FUNCIONES
  const validarFormulario = () => {
    if (!formulario.usuario) {
      return "Debe ingresar un usuario";
    }
    if (!formulario.contraseña) {
      return "Debe ingresar una contraseña";
    }
    if (!formulario.nombre_apellido) {
      return "Debe ingresar un nombre y apellido";
    }
    if (!formulario.dni) {
      return 'Debe ingresar un DNI';
    }
    if (!formulario.correo) {
      return 'Debe ingresar un correo';
    }
    if (idTransportista && !formulario.estado.trim()) {
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
      if (!idTransportista) {
        await crearTransportista(formulario)
        onSuccess("Transportista creado correctamente")
      } else {
        await modificarTransportista(
          idTransportista,
          formulario
        )
        onSuccess("Transportista modificado correctamente")
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

  const handleChange = (campo) => (e) => {
    setFormulario(prev => ({
      ...prev,
      [campo]: e.target.value
      }))
  }

  ///USE EFFECTS
  useEffect(() => {
    if (!idTransportista) {
      const timeout = setTimeout(() => {
        setFormulario({
            usuario: "",
            contraseña: "",
            nombre_apellido: "",
            dni: "",
            correo: "",
            costo_envio: "",
            estado:""
        });
      }, 0);
      return () => clearTimeout(timeout);
    }

    let cancelled = false;

    const cargarTransportista = async () => {
      try {
        const response = await obtenerTransportistaPorId(idTransportista)
        const transportista = response.data
        setEditarPassword(false);
        if (cancelled) return;
        setFormulario({
            usuario: transportista.usuario || "",
            contraseña: transportista.contraseña || "",
            nombre_apellido: transportista.nombre_apellido || "",
            dni: transportista.dni || "",
            correo: transportista.correo || "",
            costo_envio: transportista.costo_envio || "",
            estado:transportista.estado || ""
        })
      } catch (error) {
        console.error(error)
      }
    }
    cargarTransportista()
    return () => { cancelled = true; };
  }, [idTransportista, open])

  return (
    <FormularioABM
      open={open}
      titulo={
        idTransportista
          ? "Modificar Transportista"
          : "Nuevo Transportista"
      }
      onClose={handleClose}
      onSave={handleGuardar}
      loading={guardando}
    >
      <Box component="form">
        <Grid container spacing={2}>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField 
            fullWidth 
            required 
            disabled={!!idTransportista}
            label="Usuario" 
            value={formulario.usuario}
            onChange={handleChange("usuario")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField 
            fullWidth 
            required 
            label="Contraseña" 
            type= "text" 
            disabled={idTransportista && !editarPassword}
            value={formulario.contraseña}
            onChange={handleChange("contraseña")}
            slotProps={{
              input: {
                  endAdornment: idTransportista && (
                      <InputAdornment position="end">
                          <IconButton
                              onClick={() => {
                                  if (editarPassword) {
                                      setEditarPassword(false);

                                      setFormulario(prev => ({
                                          ...prev,
                                          contraseña: "***"
                                      }));
                                  } else {
                                      setEditarPassword(true);

                                      setFormulario(prev => ({
                                          ...prev,
                                          contraseña: ""
                                      }));
                                  }
                              }}
                          >
                              {editarPassword
                                  ? <CloseIcon />
                                  : <RestartAltIcon />}
                          </IconButton>
                      </InputAdornment>
                  )
              }
          }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField 
            fullWidth 
            required 
            disabled={!!idTransportista}
            label="Nombre Completo" 
            value={formulario.nombre_apellido}
            onChange={handleChange("nombre_apellido")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField 
            fullWidth 
            required 
            disabled={!!idTransportista}
            label="DNI"
            value={formulario.dni}
            onChange={handleChange("dni")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField 
            fullWidth 
            required 
            label="Correo" 
            value={formulario.correo}
            onChange={handleChange("correo")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                },
              }}
              label="Costo Envío"
              value={formulario.costo_envio}
              onChange={handleChange("costo_envio")}
            />
          </Grid>

          {idTransportista && (
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                select
                required
                label="Estado"
                value={formulario.estado}
                onChange={handleChange("estado")}
                size="small"
            >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
            </TextField>
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
