import { 
    TableContainer,
    Table, 
    TableHead, 
    TableRow, 
    TableCell, 
    TableBody,
    Skeleton,
    Chip
} from '@mui/material'
 
import { useEffect, useState } from 'react'
 
import { obtenerLiquidacionesListado } from '../../services/api.js'
import useDateFilter from '../../hooks/useDateFilter.js'
 
export default function TablaLiquidaciones({
    filtros,
    pagina = 1,
    filasPorPagina = 10,
    cantLiquidaciones,
    onTotalPaginasChange
}) {
    const [liquidaciones, setLiquidaciones] = useState([])
    const [loading, setLoading] = useState(true)
 
    const { fechaDesde, fechaHasta } = useDateFilter()
 
    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                setLoading(true)
 
                const result = await obtenerLiquidacionesListado(
                    fechaDesde ? fechaDesde.format("YYYY-MM-DD") : null,
                    fechaHasta ? fechaHasta.format("YYYY-MM-DD") : null,
                    filtros
                )
 
                setLiquidaciones(result.data)
 
                cantLiquidaciones?.(result.data.length)
 
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
    }, [
        filtros,
        fechaDesde,
        fechaHasta,
        filasPorPagina,
        onTotalPaginasChange,
        cantLiquidaciones
    ])
 
    const liquidacionesPagina = liquidaciones.slice(
        (pagina - 1) * filasPorPagina,
        pagina * filasPorPagina
    )
 
    return (
        <TableContainer 
        sx={{
            width: "100%",
            overflowX: "auto",
        }}>
            <Table size="small"
            sx={{
                minWidth: 900
            }}>
                
                {/* HEADER */}
                <TableHead sx={{ backgroundColor:"#F0EEE8" }}> 
                    <TableRow>
                        <TableCell align="center" sx={{textWrap:'nowrap'}}>Cod. Envío</TableCell>
                        <TableCell align="center" sx={{textWrap:'nowrap'}}>Fecha Envío</TableCell>
                        <TableCell align="center" sx={{textWrap:'nowrap'}}>Fecha Liquidación</TableCell>
                        <TableCell align="center" sx={{textWrap:'nowrap'}}>Transportista</TableCell>
                        <TableCell align="center" sx={{textWrap:'nowrap'}}>Liquidado</TableCell>
                        <TableCell align="center" sx={{textWrap:'nowrap'}}>Monto</TableCell>
                    </TableRow>
                </TableHead>
 
                {/* BODY */}
                <TableBody sx={{ backgroundColor:"#fff" }}>
                {
                loading ? 
                Array.from(new Array(filasPorPagina)).map((_, index) => (
                    <TableRow key={index}>
                        {Array.from(new Array(6)).map((_, cellIndex) => (
                            <TableCell key={cellIndex}>
                                <Skeleton variant="text" />
                            </TableCell>
                        ))}
                    </TableRow>
                ))
                :
                liquidacionesPagina.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} align="center">
                            No hay liquidaciones para mostrar
                        </TableCell>
                    </TableRow>
                ):
                liquidacionesPagina.map((item) => (
                    <TableRow key={item.id_envio} hover>
                        <TableCell align="center" sx={{ whiteSpace: "nowrap" }}> {item.id_envio} </TableCell>
                        <TableCell align="center" sx={{ whiteSpace: "nowrap" }}> {item.fecha_envio} </TableCell>
                        <TableCell align="center" sx={{ whiteSpace: "nowrap" }}> {item.fecha_liquidacion || "-"} </TableCell>
                        <TableCell align="center" sx={{ whiteSpace: "nowrap" }}> {item.transportista} </TableCell>
                        <TableCell align="center">
                            <Chip
                                label={item.liquidado ? "Sí" : "No"}
                                color={item.liquidado ? "success" : "default"}
                                size="small"
                            />
                        </TableCell>
                        <TableCell align="center" sx={{ whiteSpace: "nowrap" }}> $ {Number(item.monto || 0).toLocaleString('es-AR')} </TableCell>
                    </TableRow>
                ))
                }
                </TableBody>
 
            </Table>
        </TableContainer>
    )
}
 
