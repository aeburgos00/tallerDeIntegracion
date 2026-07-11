import {
    Box,
    TextField,
    Autocomplete,
} from "@mui/material"

import { useEffect, useState } from 'react'
import { obtenerEstados, obtenerClientes, obtenerLocalidadesActivas } from "../../services/api";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/es";

export default function FiltroEnviosTransportista({
    filtros,
    setFiltros
}) {

    const [estados, setEstados] = useState([])
    const [clientes, setClientes] = useState([])
    const [localidades, setLocalidades] = useState([])

    useEffect(() => {
        const cargarCombos = async () => {
            try {
                const [estadosResp, clientesResp, localidadesResp] = await Promise.all([
                    obtenerEstados(),
                    obtenerClientes(),
                    obtenerLocalidadesActivas()
                ])
                setEstados(estadosResp.data ?? [])
                setClientes(clientesResp.data ?? [])
                setLocalidades(localidadesResp.data ?? [])
            } catch (error) {
                console.error(error)
            }
        }
        cargarCombos()
    }, [])   // ← solo al montar, no en cada render

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
        }}>

            {/* Fecha — ancho completo, igual que los demás */}
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                <DatePicker
                    label="Fecha Envío"
                    value={filtros.fechaEnvio}
                    onChange={(newValue) =>
                        setFiltros({ ...filtros, fechaEnvio: newValue })
                    }
                    format="DD/MM/YYYY"
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            size: "small",
                            sx: { "& .MuiOutlinedInput-root": { borderRadius: 2 } }
                        }
                    }}
                />
            </LocalizationProvider>

            {/* Cliente — combo */}
            <Autocomplete
                fullWidth
                options={clientes}
                value={clientes.find(c => c.nombre_apellido === filtros.cliente) ?? null}
                getOptionLabel={(option) => option.nombre_apellido}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, value) =>
                    setFiltros({ ...filtros, cliente: value?.nombre_apellido ?? "" })
                }
                renderInput={(params) => (
                    <TextField {...params} fullWidth label="Cliente" size="small" />
                )}
            />

            {/* Dirección — texto libre (depende del cliente) */}
            <TextField
                fullWidth
                label="Dirección"
                value={filtros.direccion}
                onChange={(e) => setFiltros({ ...filtros, direccion: e.target.value })}
                size="small"
            />

            {/* Localidad — combo */}
            <Autocomplete
                fullWidth
                options={localidades}
                value={localidades.find(l => l.nombre === filtros.localidad) ?? null}
                getOptionLabel={(option) => option.nombre}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, value) =>
                    setFiltros({ ...filtros, localidad: value?.nombre ?? "" })
                }
                renderInput={(params) => (
                    <TextField {...params} fullWidth label="Localidad" size="small" />
                )}
            />

            {/* Estado — combo */}
            <Autocomplete
                fullWidth
                options={estados}
                value={estados.find(e => e.id === filtros.estado) ?? null}
                getOptionLabel={(option) => option.descripcion}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, value) =>
                    setFiltros({ ...filtros, estado: value?.id ?? "" })
                }
                renderInput={(params) => (
                    <TextField {...params} fullWidth label="Estado" size="small" />
                )}
            />

        </Box>
    )
}