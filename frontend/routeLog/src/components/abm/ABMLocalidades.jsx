import {
    TextField,
    Box,
    Grid,
    InputAdornment,
    Autocomplete,
    Snackbar,
    Alert,
    MenuItem
} from "@mui/material";

import { useEffect, useState } from "react";

import FormularioABM from "../../layouts/FormularioABM";

import {
    crearLocalidad,
    modificarLocalidad,
    obtenerLocalidadPorId,
    obtenerProvincias
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
    onSuccess
}) {

    const [formulario, setFormulario] = useState(formularioInicial);
    const [provincias, setProvincias] = useState([]);

    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState(false);
    const [guardando, setGuardando] = useState(false);

    const provinciaSeleccionada =
        provincias.find(
            p => p.nombre.toLowerCase() === formulario.provincia?.toLowerCase()
        ) ?? null;

    const handleChange = (campo) => (e) => {
        setFormulario(prev => ({
            ...prev,
            [campo]: e.target.value
        }));
    };

    const validarFormulario = () => {
        if (!formulario.nombre?.trim()) {
            return "Debe ingresar el nombre de la localidad";
        }
        if (!formulario.codigo_postal?.trim()) {
            return "Debe ingresar el código postal";
        }
        if (!formulario.provincia) {
            return "Debe seleccionar la provincia";
        }
        if (
            formulario.costo_envio === "" ||
            Number(formulario.costo_envio) <= 0
        ) {
            return "El costo de envío debe ser mayor a 0";
        }
        return null;
    };

    const limpiarFormulario = () => {
        setFormulario(formularioInicial);
    };

    const handleGuardar = async () => {
        const errorValidacion = validarFormulario();

        if (errorValidacion) {
            setMensaje(errorValidacion);
            setError(true);
            return;
        }

        try {
            setGuardando(true);

            const payload = {
                ...formulario,
                costo_envio: Number(formulario.costo_envio)
            };

            const result = idLocalidad
                ? await modificarLocalidad(idLocalidad, payload)
                : await crearLocalidad(payload);

            if (!result.ok) {
                throw new Error(result.error || "Ocurrió un error al guardar");
            }

            onSuccess?.(
                idLocalidad
                    ? "Localidad modificada correctamente"
                    : "Localidad creada correctamente"
            );

            limpiarFormulario();
            onClose();

        } catch (error) {
            setMensaje(error?.message || "Ocurrió un error al guardar");
            setError(true);
        } finally {
            setGuardando(false);
        }
    };

    // Combo de provincias — se carga una sola vez
    useEffect(() => {
        const cargarProvincias = async () => {
            try {
                const response = await obtenerProvincias();
                setProvincias(response.data ?? []);
            } catch (error) {
                console.error(error);
            }
        }
        cargarProvincias();
    }, []);

    useEffect(() => {

        if (!open) return

        if (!idLocalidad) {
            const timeout = setTimeout(() => {
                setFormulario(formularioInicial);
            }, 0);
            return () => clearTimeout(timeout);
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
            loading={guardando}
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
                        <Autocomplete
                            fullWidth
                            options={provincias}
                            value={provinciaSeleccionada}
                            getOptionLabel={(option) => option.nombre}
                            isOptionEqualToValue={(option, value) =>
                                option.id === value.id
                            }
                            onChange={(event, value) => {
                                setFormulario(prev => ({
                                    ...prev,
                                    provincia: value?.nombre ?? ""
                                }))
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    required
                                    label="Provincia"
                                />
                            )}
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

                    {idLocalidad && (
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
                            <MenuItem value="true">Activo</MenuItem>
                            <MenuItem value="false">Inactivo</MenuItem>
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
                <Alert severity={error ? "error" : "success"}>
                    {mensaje}
                </Alert>
            </Snackbar>

        </FormularioABM>
    )
}