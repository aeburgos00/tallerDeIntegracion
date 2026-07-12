import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Skeleton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Snackbar,
    Alert,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useEffect, useState } from 'react'
import {
    obtenerLocalidades,
    eliminarLocalidad,
    cambiarEstadoLocalidad
} from '../../services/api.js'

const colores = {
    azul: "#3b82f6",
    gris: "#9ca3af",
}

export default function TablaLocalidades({
    filtros = {},
    pagina = 1,
    filasPorPagina = 10,
    onTotalPaginasChange,
    cantLocalidades,
    refresh = 0,
    onEdit,
    onActionSuccess
}) {

    const [loading, setLoading] = useState(true)
    const [localidades, setLocalidades] = useState([])
    const [refreshAccion, setRefreshAccion] = useState(0)
    const [mensaje, setMensaje] = useState("")
    const [error, setError] = useState(false)
    const [openEliminar, setOpenEliminar] = useState(false)
    const [localidadSeleccionada, setLocalidadSeleccionada] = useState(null)

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                setLoading(true)
                const result = await obtenerLocalidades(filtros)
                setLocalidades(result.data)

                cantLocalidades?.(result.data.length)

                const totalPaginas = Math.max(
                    1,
                    Math.ceil(result.data.length / filasPorPagina)
                )
                onTotalPaginasChange?.(totalPaginas)

            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        obtenerDatos()
    }, [filtros, refresh, refreshAccion, filasPorPagina, onTotalPaginasChange, cantLocalidades])

    const localidadesPagina = localidades.slice(
        (pagina - 1) * filasPorPagina,
        pagina * filasPorPagina
    )

    const handleAbrirDialogo = (localidad) => {
        setLocalidadSeleccionada(localidad)
        setOpenEliminar(true)
    }

    const handleCerrarDialogo = () => {
        setOpenEliminar(false)
        setLocalidadSeleccionada(null)
    }

    const handleConfirmarEliminar = async () => {
        try {
            await eliminarLocalidad(localidadSeleccionada.id_loc)
            setMensaje("Localidad dada de baja correctamente")
            setError(false)
            handleCerrarDialogo()
            setRefreshAccion(prev => prev + 1)
            onActionSuccess?.()
        } catch (error) {
            setMensaje(error?.message || "Error al dar de baja la localidad")
            setError(true)
        }
    }

    const handleToggleEstado = async (localidad) => {
        try {
            await cambiarEstadoLocalidad(localidad.id_loc)
            setMensaje("Estado actualizado correctamente")
            setError(false)
            setRefreshAccion(prev => prev + 1)
            onActionSuccess?.()
        } catch (error) {
            setMensaje(error?.message || "Error al cambiar el estado")
            setError(true)
        }
    }

    return (
        <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
            <Table size="small" sx={{ minWidth: 900 }}>
                <TableHead sx={{ backgroundColor: "#F0EEE8" }}>
                    <TableRow>
                        <TableCell align="center" sx={{ textWrap: 'nowrap' }}>Localidad</TableCell>
                        <TableCell align="center" sx={{ textWrap: 'nowrap' }}>Código Postal</TableCell>
                        <TableCell align="center" sx={{ textWrap: 'nowrap' }}>Provincia</TableCell>
                        <TableCell align="center" sx={{ textWrap: 'nowrap' }}>Costo Envío</TableCell>
                        <TableCell align="center" sx={{ textWrap: 'nowrap' }}>Fecha Alta</TableCell>
                        <TableCell align="center" sx={{ textWrap: 'nowrap' }}>Fecha Baja</TableCell>
                        <TableCell align="center" sx={{ textWrap: 'nowrap' }}>Estado</TableCell>
                        <TableCell align="center" sx={{ textWrap: 'nowrap' }}>Acciones</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody sx={{ backgroundColor: "#fff" }}>
                    {loading
                        ? Array.from(new Array(filasPorPagina)).map((_, index) => (
                            <TableRow key={index}>
                                {Array.from(new Array(8)).map((_, cellIndex) => (
                                    <TableCell key={cellIndex}>
                                        <Skeleton variant="text" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                        : localidadesPagina.map((item) => (
                            <TableRow key={item.id_loc} hover>
                                <TableCell sx={{ whiteSpace: "nowrap" }}>{item.nombre}</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap" }}>{item.codigo_postal}</TableCell>
                                <TableCell sx={{ textWrap: 'nowrap' }}>{item.provincia}</TableCell>
                                <TableCell sx={{ textWrap: 'nowrap' }}> $ {Number(item.costo_envio || 0).toLocaleString('es-AR')} </TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap" }}>{item.fecha_alta}</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap" }}>{item.fecha_baja || "-"}</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap" }}>
                                    <Chip
                                        label={item.estado}
                                        size="small"
                                        clickable
                                        onClick={() => handleToggleEstado(item)}
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: 12,
                                            borderRadius: 1,
                                            cursor: "pointer",
                                            background: item.estado === "Activo" ? "#dcfce7" : "#fee2e2",
                                            color: item.estado === "Activo" ? "#166534" : "#991b1b",
                                            "&:hover": { opacity: 0.85 }
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton color="primary" onClick={() => onEdit(item)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleAbrirDialogo(item)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>

            <Dialog open={openEliminar} onClose={handleCerrarDialogo}>
                <DialogTitle>Dar de baja localidad</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Está seguro que desea dar de baja la localidad "{localidadSeleccionada?.nombre}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleCerrarDialogo}
                        sx={{ borderColor: colores.gris, color: colores.azul, borderRadius: 2, textTransform: "none" }}>
                        Volver
                    </Button>
                    <Button variant="contained" color="error"
                        sx={{ borderRadius: 2, textTransform: "none" }}
                        onClick={handleConfirmarEliminar}>
                        Dar de baja
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={!!mensaje} autoHideDuration={4000} onClose={() => setMensaje("")}>
                <Alert severity={error ? "error" : "success"}>
                    {mensaje}
                </Alert>
            </Snackbar>

        </TableContainer>
    )
}