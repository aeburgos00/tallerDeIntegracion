import {
  TextField,
  Box,
  Grid,
  Snackbar,
  Alert
} from "@mui/material";

import { useState } from "react";

import FormularioABM from "../../layouts/FormularioABM";

import { crearCliente } from "../../services/api";

export default function ABMEnvios({
  open,
  onClose,
  onSuccess
}) {

  //VARIABLES
  const [formulario, setFormulario] = useState({
    nombre_apellido: "",
    dni: ""
  })
  const formularioInicial = {
    nombre_apellido: "",
    dni: ""
  }
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);
  const [guardando, setGuardando] = useState(false)

  //FUNCIONES
  const limpiarFormulario = () => {
    setFormulario(formularioInicial)
  }

  const handleClose = () => {
    limpiarFormulario()
    onClose()
  }

  const validarFormulario = () => {    
    if (!formulario.dni) {
      return "Debe ingresar DNI";
    }
    if (!formulario.nombre_apellido) {
      return "Debe ingresar el nombre y apellido";
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
          await crearCliente(formulario)
          setError(false);
          onSuccess("Cliente creado correctamente")
          limpiarFormulario();
          onClose();
        } catch(error) {
          setMensaje(
            error?.message || "Ocurrió un error al guardar"
          );
          setError(true);
        } finally {
          setGuardando(false)
        }
  }

  const handleChange = (campo) => (e) => {
    setFormulario(prev => ({
      ...prev,
      [campo]: e.target.value
      }))
  }

  return (
    <FormularioABM
      open={open}
      titulo={
        "Nuevo Cliente"
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
                label="DNI" 
                value={formulario.dni}
                onChange={handleChange("dni")}
                />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField 
                fullWidth 
                required 
                label="Nombre Completo" 
                value={formulario.nombre_apellido}
                onChange={handleChange("nombre_apellido")}
                />
            </Grid>
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