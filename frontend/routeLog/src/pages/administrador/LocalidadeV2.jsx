import {
    Box,
    Button,
    Skeleton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Chip,
} from "@mui/material"

import SummaryCard from "../../components/SummaryCard"

import { useEffect, useState } from 'react'

import cardsLocalidades from "../../components/dataKPILocalidades.jsx"

import { obtenerLocalidadesTotales } from "../../services/api.js"

const mockLocalidades = [
    { id: 1, nombre: "San Justo", codigo_postal: "1754", tarifa: 1200, activo: true },
    { id: 2, nombre: "La Matanza", codigo_postal: "1752", tarifa: 1500, activo: true },
    { id: 3, nombre: "Ramos Mejía", codigo_postal: "1704", tarifa: 1800, activo: false },
    { id: 4, nombre: "Morón", codigo_postal: "1708", tarifa: 1350, activo: true },
    { id: 5, nombre: "Lomas de Zamora", codigo_postal: "1832", tarifa: 2000, activo: false },
]

export default function Localidades() {

    const [loadingKPI, setLoadingKPI] = useState(true)
    const [localidades, setLocalidades] = useState([])
    const [tablaLocalidades, setTablaLocalidades] = useState(mockLocalidades)
    const [modalAbierto, setModalAbierto] = useState(false)
    const [formulario, setFormulario] = useState({
        nombre: "", codigo_postal: "", tarifa: ""
    })

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                setLoadingKPI(true)
                const result = await obtenerLocalidadesTotales()
                setLocalidades(result.data[0])
            } catch (error) {
                console.error(error)
            } finally {
                setLoadingKPI(false)
            }
        }
        obtenerDatos()
    }, [])

    const loc = cardsLocalidades.map(e => ({
        ...e,
        cantidad: e.id !== "costo_promedio" ?
            Number(localidades[e.id]) || 0
            :
            "$" + (Number(localidades[e.id]) || 0)
    }))

    const handleAbrir = () => setModalAbierto(true)
    const handleCerrar = () => {
        setModalAbierto(false)
        setFormulario({ nombre: "", codigo_postal: "", tarifa: "" })
    }
    const handleChange = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value })
    }
    const handleGuardar = () => {
        console.log("Nueva localidad:", formulario)
        // TODO: conectar con backend
        handleCerrar()
    }

    const toggleActivo = (id) => {
        setTablaLocalidades(prev =>
            prev.map(l => l.id === id ? { ...l, activo: !l.activo } : l)
        )
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

            {/* KPI Header */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" },
                    gap: 2
                }}
            >
                {loadingKPI ?
                    Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} variant="rounded" height={112} />
                    ))
                    :
                    loc.map((e, index) => (
                        <SummaryCard
                            key={index}
                            titulo={e.titulo}
                            cantidad={e.cantidad}
                            descripcion={e.descripcion || ""}
                            icono={e.icono}
                            color={e.color}
                            height={112}
                        />
                    ))
                }
            </Box>

            {/* Mostrado + CSV + ABM */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>Mostrando {tablaLocalidades.length} localidades</h3>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button variant="outlined">Exportar CSV</Button>
                    <Button variant="contained" onClick={handleAbrir}>
                        Nueva Localidad
                    </Button>
                </Box>
            </Box>

            {/* Tabla */}
            <TableContainer sx={{ borderRadius: 3, overflowX: "auto" }}>
                <Table size="small" sx={{ minWidth: 650 }}>

                    <TableHead sx={{ backgroundColor: "#F0EEE8" }}>
                        <TableRow>
                            <TableCell align="center" sx={{ textWrap: "nowrap" }}>ID</TableCell>
                            <TableCell align="center" sx={{ textWrap: "nowrap" }}>Nombre</TableCell>
                            <TableCell align="center" sx={{ textWrap: "nowrap" }}>Código Postal</TableCell>
                            <TableCell align="center" sx={{ textWrap: "nowrap" }}>Tarifa ($)</TableCell>
                            <TableCell align="center" sx={{ textWrap: "nowrap" }}>Estado</TableCell>
                            <TableCell align="center" sx={{ textWrap: "nowrap" }}>Acción</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody sx={{ backgroundColor: "#fff" }}>
                        {tablaLocalidades.map((l) => (
                            <TableRow key={l.id} hover>
                                <TableCell align="center">{l.id}</TableCell>
                                <TableCell sx={{ textWrap: "nowrap" }}>{l.nombre}</TableCell>
                                <TableCell align="center">{l.codigo_postal}</TableCell>
                                <TableCell align="center">${l.tarifa.toLocaleString("es-AR")}</TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={l.activo ? "Activo" : "Inactivo"}
                                        size="small"
                                        sx={{
                                            backgroundColor: l.activo ? "#e6f4d7" : "#fde8e8",
                                            color: l.activo ? "#639922" : "#D23B3B",
                                            fontWeight: 600
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color={l.activo ? "error" : "success"}
                                        onClick={() => toggleActivo(l.id)}
                                    >
                                        {l.activo ? "Desactivar" : "Activar"}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>

            {/* Modal Nueva Localidad */}
            <Dialog open={modalAbierto} onClose={handleCerrar} fullWidth maxWidth="sm">
                <DialogTitle>Nueva Localidad</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <TextField
                        label="Nombre"
                        name="nombre"
                        value={formulario.nombre}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Código Postal"
                        name="codigo_postal"
                        value={formulario.codigo_postal}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Tarifa ($)"
                        name="tarifa"
                        value={formulario.tarifa}
                        onChange={handleChange}
                        inputProps={{ min: 0, step: "any" }}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCerrar} color="error">Cancelar</Button>
                    <Button onClick={handleGuardar} variant="contained">Guardar</Button>
                </DialogActions>
            </Dialog>

        </Box>
    )
}