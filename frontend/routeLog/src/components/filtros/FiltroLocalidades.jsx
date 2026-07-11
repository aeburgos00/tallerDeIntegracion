import {
    Box,
    TextField,
    Autocomplete,
} from "@mui/material"

import { useEffect, useState } from 'react'
import {
    obtenerProvincias,
    obtenerLocalidades
} from "../../services/api"

export default function FiltroLocalidades({
    filtros,
    setFiltros
}) {

    const [provincias, setProvincias] = useState([])
    const [localidades, setLocalidades] = useState([])

    useEffect(() => {
        const cargarCombos = async () => {
            try {
                const [provinciasResp, localidadesResp] = await Promise.all([
                    obtenerProvincias(),
                    obtenerLocalidades()
                ])
                setProvincias(provinciasResp.data ?? [])
                setLocalidades(localidadesResp.data ?? [])
            } catch (error) {
                console.error(error)
            }
        }
        cargarCombos()
    }, [])

    // Códigos postales únicos derivados de las localidades ya cargadas
    const codigosPostales = [
        ...new Set(localidades.map(l => l.codigo_postal).filter(Boolean))
    ].sort()

    const estadoOpciones = [
        { label: "Activo", value: "Activo" },
        { label: "Inactivo", value: "Inactivo" },
    ]

    return (
        <Box sx={{
            display: "grid",
            gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                lg: "220px 140px 140px 220px"
            },
            gap: 2,
            alignItems: "center",
        }}>

            {/* Provincia */}
            <Autocomplete
                fullWidth
                options={provincias}
                value={provincias.find(p => p.nombre === filtros.provincia) ?? null}
                getOptionLabel={(option) => option.nombre}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, value) =>
                    setFiltros({ ...filtros, provincia: value?.nombre ?? "" })
                }
                renderInput={(params) => (
                    <TextField {...params} label="Provincia" size="small" />
                )}
            />

            {/* Localidad */}
            <Autocomplete
                fullWidth
                options={localidades}
                value={localidades.find(l => l.nombre === filtros.localidad) ?? null}
                getOptionLabel={(option) => option.nombre}
                isOptionEqualToValue={(option, value) => option.id_loc === value.id_loc}
                onChange={(event, value) =>
                    setFiltros({ ...filtros, localidad: value?.nombre ?? "" })
                }
                renderInput={(params) => (
                    <TextField {...params} label="Localidad" size="small" />
                )}
            />

            {/* Código Postal */}
            <Autocomplete
                fullWidth
                options={codigosPostales}
                value={filtros.codigoPostal || null}
                getOptionLabel={(option) => option}
                onChange={(event, value) =>
                    setFiltros({ ...filtros, codigoPostal: value ?? "" })
                }
                renderInput={(params) => (
                    <TextField {...params} label="Código Postal" size="small" />
                )}
            />

            {/* Estado */}
            <Autocomplete
                fullWidth
                options={estadoOpciones}
                value={estadoOpciones.find(e => e.value === filtros.estado) ?? null}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                onChange={(event, value) =>
                    setFiltros({ ...filtros, estado: value?.value ?? "" })
                }
                renderInput={(params) => (
                    <TextField {...params} label="Estado" size="small" />
                )}
            />

        </Box>
    )
}