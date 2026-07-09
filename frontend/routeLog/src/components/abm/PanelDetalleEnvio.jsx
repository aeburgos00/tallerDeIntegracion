import {
    TextField,
    Box,
    Grid,
    Autocomplete,
    Snackbar,
    Alert
} from "@mui/material";

import { useEffect, useState } from "react";

import FormularioABM from "../../layouts/FormularioABM";

import { obtenerEstados } from "../../services/api";
import { cambiarEstadoEnvio } from "../../services/apiTransportistas";

export default function PanelDetalleEnvio({
    open,
    onClose,
    envio,
    onSuccess
}) {

    const [estados, setEstados] = useState([])
    const [idEstado, setIdEstado] = useState(null)

    const [guardando, setGuardando] = useState(false)
    const [mensaje, setMensaje] = useState("")
    const [error, setError] = useState(false)

    useEffect(() => {
        const cargarEstados = async () => {
            try {
                const response = await obtenerEstados()
                setEstados(response.data ?? [])
            } catch (error) {
                console.error(error)
            }
        }
        cargarEstados()
    }, [])

    useEffect(() => {
        if (envio) {
            setIdEstado(envio.id_estado)
        }
    }, [envio])

    const estadoSeleccionado =
        estados.find(e => e.id === idEstado) ?? null

    const handleGuardar = async () => {
        if (!idEstado) {
            setMensaje("Debe seleccionar un estado")
            setError(true)
            return
        }

        try {
            setGuardando(true)
            const result = await cambiarEstadoEnvio(envio.id_envio, idEstado)

            if (!result.ok) {
                throw new Error(result.error || "Ocurrió un error al guardar")
            }

            onSuccess?.("Estado actualizado correctamente")
            onClose()
        } catch (error) {
            setMensaje(error?.message || "Ocurrió un error al guardar")
            setError(true)
        } finally {
            setGuardando(false)
        }
    }

    if (!envio) return null

    return (
        <FormularioABM
            open={open}
            titulo={`Envío #${envio.id_envio}`}
            onClose={onClose}
            onSave={handleGuardar}
            loading={guardando}
        >
            <Box component="form">
                <Grid container spacing={2}>

                    <Grid size={{ xs: 12 }}>
                        <TextField fullWidth disabled label="Cliente" value={envio.cliente || ""} />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField fullWidth disabled label="Dirección" value={envio.direccion || ""} />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth disabled label="Localidad" value={envio.localidad || ""} />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth disabled label="Fecha Envío" value={envio.fecha_envio || ""} />
                    </Grid>


                    <Grid size={{ xs: 12 }}>
                        <Autocomplete
                            fullWidth
                            options={estados}
                            value={estadoSeleccionado}
                            getOptionLabel={(option) => option.descripcion}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            onChange={(event, value) => setIdEstado(value?.id ?? null)}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth required label="Estado" />
                            )}
                        />
                    </Grid>

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