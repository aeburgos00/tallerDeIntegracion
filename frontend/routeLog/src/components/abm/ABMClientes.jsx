import {
  TextField,
  Box,
  Grid,
} from "@mui/material";

import { useState } from "react";

import FormularioABM from "../../layouts/FormularioABM";

export default function ABMEnvios({
  open,
  onClose
}) {
  const handleGuardar = async () => {
    console.log("guardar")
  }

    const handleChange = (campo) => (e) => {
        setFormulario(prev => ({
        ...prev,
        [campo]: e.target.value
        }))
    }

  const [formulario, setFormulario] = useState({
    nombre_apellido: "",
    dni: ""
  })

  return (
    <FormularioABM
      open={open}
      titulo={
        "Nuevo Cliente"
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
    </FormularioABM>
  )
}