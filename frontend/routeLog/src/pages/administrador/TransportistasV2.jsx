import { useState } from "react"
import {
    Box,
    Button,
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

import SummaryCard from "../../components/SummaryCard.jsx"
import AbcIcon from '@mui/icons-material/Abc';

const kpi = [
    { "titulo": "KP1" },
    { "titulo": "KP2" },
    { "titulo": "KP3" },
    { "titulo": "KP4" }
]

{/* MOCK DATA */ }
const mockTransportistas = [
    { id: 1, nombre: "Juan Pérez", fecha_creacion: "01/01/2025", tarifa: 1500, correo: "juan@mail.com", activo: true },
    { id: 2, nombre: "María López", fecha_creacion: "15/03/2025", tarifa: 1800, correo: "maria@mail.com", activo: true },
    { id: 3, nombre: "Carlos Gómez", fecha_creacion: "10/06/2025", tarifa: 1200, correo: "carlos@mail.com", activo: false },
    { id: 4, nombre: "Ana Martínez", fecha_creacion: "22/08/2025", tarifa: 2000, correo: "ana@mail.com", activo: true },
    { id: 5, nombre: "Pedro Rodríguez", fecha_creacion: "05/11/2025", tarifa: 1650, correo: "pedro@mail.com", activo: false },
]

export default function Transportistas() {

    const fechaActual = new Date().toLocaleDateString("es-AR", {
        day: "2-digit", month: "2-digit", year: "numeric"
    })

    const [modalAbierto, setModalAbierto] = useState(false)
    const [transportistas, setTransportistas] = useState(mockTransportistas)
    const [formulario, setFormulario] = useState({
        nombre: "", apellido: "", tarifa: ""
    })

    const handleAbrir = () => setModalAbierto(true)
    const handleCerrar = () => {
        setModalAbierto(false)
        setFormulario({ nombre: "", apellido: "", tarifa: "" })
    }
    const handleChange = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value })
    }
    const handleGuardar = () => {
        console.log("Nuevo transportista:", { ...formulario, fecha_creacion: fechaActual })
        handleCerrar()
    }

    const toggleActivo = (id) => {
        setTransportistas(prev =>
            prev.map(t => t.id === id ? { ...t, activo: !t.activo } : t)
        )
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

            {/* KPI x4 */}
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
                {kpi.map((e) => (
                    <SummaryCard
                        key={e.titulo}
                        titulo={e.titulo}
                        cantidad={"0"}
                        descripcion={""}
                        icono={AbcIcon}
                    />
                ))}
            </Box>

            {/* Mostrado + CSV + ABM */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>Mostrando {transportistas.length} transportistas</h3>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button variant="outlined">Exportar CSV</Button>
                    <Button variant="contained" onClick={handleAbrir}>
                        Nuevo Transportista
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
                            <TableCell align="center" sx={{ textWrap: "nowrap" }}>Fecha de Creación</TableCell>
                            <TableCell align="center" sx={{ textWrap: "nowrap" }}>Tarifa ($)</TableCell>
                            <TableCell align="center" sx={{ textWrap: "nowrap" }}>Correo</TableCell>
                            <TableCell align="center" sx={{ textWrap: "nowrap" }}>Usuario Activo</TableCell>
                            <TableCell align="center" sx={{ textWrap: "nowrap" }}>Acción</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody sx={{ backgroundColor: "#fff" }}>
                        {transportistas.map((t) => (
                            <TableRow key={t.id} hover>
                                <TableCell align="center">{t.id}</TableCell>
                                <TableCell sx={{ textWrap: "nowrap" }}>{t.nombre}</TableCell>
                                <TableCell align="center">{t.fecha_creacion}</TableCell>
                                <TableCell align="center">${t.tarifa.toLocaleString("es-AR")}</TableCell>
                                <TableCell align="center">{t.correo}</TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={t.activo ? "Activo" : "Inactivo"}
                                        size="small"
                                        sx={{
                                            backgroundColor: t.activo ? "#e6f4d7" : "#fde8e8",
                                            color: t.activo ? "#639922" : "#D23B3B",
                                            fontWeight: 600
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color={t.activo ? "error" : "success"}
                                        onClick={() => toggleActivo(t.id)}
                                    >
                                        {t.activo ? "Desactivar" : "Activar"}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>

            {/* Modal */}
            <Dialog open={modalAbierto} onClose={handleCerrar} fullWidth maxWidth="sm">
                <DialogTitle>Nuevo Transportista</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <TextField label="Nombre" name="nombre" value={formulario.nombre} onChange={handleChange} fullWidth />
                    <TextField label="Apellido" name="apellido" value={formulario.apellido} onChange={handleChange} fullWidth />
                    <TextField label="Tarifa ($)" name="tarifa" value={formulario.tarifa} onChange={handleChange} inputProps={{ min: 0, step: "any" }} fullWidth />
                    <TextField label="Fecha de creación" value={fechaActual} fullWidth disabled
                        sx={{ "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "gray" } }}
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