import {
    Box,
    TextField,
    MenuItem,
    InputAdornment,
} from "@mui/material"

import { useEffect, useState } from 'react'
import { obtenerEstados } from "../../services/api";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/es";

export default function FiltroEnvios({
    filtros,
    setFiltros
}) {

    const [estados, setEstados] = useState([])
    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const result = await obtenerEstados()
                setEstados(result.data)
            } catch (error) {
                console.error(error)
            }
        }
        obtenerDatos()
    })

    const handleChange = (campo) => (e) => {
        setFiltros({
            ...filtros,
            [campo]: e.target.value
        });
    };

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    lg: "150px 180px 180px 180px 180px 130px 120px 120px"
                },
                gap: 2,
                alignItems: "center",
            }}>

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                <DatePicker
                    label="Fecha Envío"
                    value={filtros.fechaEnvio}
                    onChange={(newValue) =>
                        setFiltros({
                            ...filtros,
                            fechaEnvio: newValue
                        })}
                    format="DD/MM/YYYY"
                    slotProps={{
                        textField: {
                            size: "small"
                        }
                    }}
                    sx={{
                        width: {
                            xs: 100,
                            sm: 140,
                            md: 180
                        }
                    }}
                />
            </LocalizationProvider>

            <TextField
                fullWidth
                label="Cliente"
                value={filtros.cliente}
                onChange={handleChange("cliente")}
                size="small"
            />

            <TextField
                fullWidth
                label="Dirección"
                value={filtros.direccion}
                onChange={handleChange("direccion")}
                size="small"
            />

            <TextField
                fullWidth
                label="Localidad"
                value={filtros.localidad}
                onChange={handleChange("localidad")}
                size="small"
            />

            <TextField
                fullWidth
                select
                label="Estado"
                value={filtros.estado}
                onChange={handleChange("estado")}
                size="small"
            >
                {
                    estados.map((item) => (
                        <MenuItem value={item.id}>{item.descripcion}</MenuItem>
                    ))
                }
            </TextField>
        </Box>
    )
}