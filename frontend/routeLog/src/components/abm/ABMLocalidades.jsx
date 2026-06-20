import {
    TextField,
    Box,
    Grid,
    InputAdornment
} from "@mui/material";

import { useEffect, useState } from "react";

import FormularioABM from "../../layouts/FormularioABM";

import {
    crearLocalidad,
    modificarLocalidad,
    obtenerLocalidadPorId
} from "../../services/api";

const formularioInicial = {
    nombre: "",
    codigo_postal: "",
    provincia: "",
    costo_envio: "",
    estado: true
}

export default function ABMLocalidades({
    open,
    onClose,
    idLocalidad,
    onSaved
}) {

    const [formulario, setFormulario] = useState(formularioInicial);

    const handleChange = (campo) => (e) => {
        setFormulario(prev => ({
            ...prev,
            [campo]: e.target.value
        }));
    };

    const handleGuardar = async () => {
        try {
            const payload = {
                ...formulario,
                costo_envio: Number(formulario.costo_envio)
            }

            if (idLocalidad) {
                await modificarLocalidad(idLocalidad, payload)
            } else {
                await crearLocalidad(payload)
            }

            onSaved?.()
            onClose()

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {

        if (!open) return

        if (!idLocalidad) {
            setFormulario(formularioInicial);
            return;
        }

        const cargarLocalidad = async () => {
            try {
                const response = await obtenerLocalidadPorId(idLocalidad);
                const localidad = response.data;

                setFormulario({
                    nombre: localidad.nombre || "",
                    codigo_postal: localidad.codigo_postal || "",
                    provincia: localidad.provincia || "",
                    costo_envio: localidad.costo_envio || "",
                    estado: localidad.estado
                });
            } catch (error) {
                console.error(error);
            }
        }

        cargarLocalidad();

    }, [idLocalidad, open]);

    return (
        <FormularioABM
            open={open}
            titulo={idLocalidad ? "Modificar Localidad" : "Nueva Localidad"}
            onClose={onClose}
            onSave={handleGuardar}
        >
            <Box component="form">
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            label="Nombre"
                            value={formulario.nombre}
                            onChange={handleChange("nombre")}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            label="Código Postal"
                            value={formulario.codigo_postal}
                            onChange={handleChange("codigo_postal")}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            label="Provincia"
                            value={formulario.provincia}
                            onChange={handleChange("provincia")}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="Costo de Envío"
                            value={formulario.costo_envio}
                            onChange={handleChange("costo_envio")}
                            slotProps={{
                                input: {
                                    startAdornment:
                                        <InputAdornment position="start">$</InputAdornment>
                                }
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>
        </FormularioABM>
    )
}