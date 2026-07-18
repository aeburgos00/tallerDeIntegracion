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
 
import { obtenerLiquidaciones } from '../../services/api.js'
import useDateFilter from '../../hooks/useDateFilter.js'

const colores = {
    Cerrada : "#65a30d",
    Abierta : "#ef9227"
}
 
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
 
                const result = await obtenerLiquidaciones(
                    fechaDesde ? fechaDesde.format("YYYY-MM-DD") : null,
                    fechaHasta ? fechaHasta.format("YYYY-MM-DD") : null,
                    filtros
                )
 
                setLiquidaciones(result.data || [])
 
                cantLiquidaciones?.((result.data || []).length)
 
                const totalPaginas = Math.max(
                    1,
                    Math.ceil((result.data || []).length / filasPorPagina)
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
                <TableHead sx={{ backgroundColor:"#F0EEE8" }}> 
                    <TableRow>
                        <TableCell align="center" sx={{textWrap:'nowrap'}}>Transportista</TableCell>
                        <TableCell align="center" sx={{textWrap:'nowrap'}}>Semana</TableCell>
                        <TableCell align="center" sx={{textWrap:'nowrap'}}>Cant. Envíos</TableCell>
                        <TableCell align="center" sx={{textWrap:'nowrap'}}>Monto Total</TableCell>
                        <TableCell align="center" sx={{textWrap:'nowrap'}}>Estado</TableCell>
                        <TableCell align="center" sx={{textWrap:'nowrap'}}>Fecha Cierre</TableCell>
                    </TableRow>
                </TableHead>
 
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
                    <TableRow key={item.id} hover>
                        <TableCell sx={{whiteSpace: "nowrap"}}>{item.transportista}</TableCell>
                        <TableCell sx={{whiteSpace: "nowrap"}} align="center" >{item.semana}</TableCell>
                        <TableCell sx={{textWrap:'nowrap'}} align="center">{item.cant_envios}</TableCell>
                        <TableCell sx={{textWrap:'nowrap'}} align="center">$ {Number(item.monto_total || 0).toLocaleString('es-AR')} </TableCell>
                        <TableCell sx={{textWrap:'nowrap'}} align="center">
                            <Chip
                                label={item.estado}
                                sx={{
                                    color: colores[item.estado],
                                    fontWeight: 700,
                                    backgroundColor: `${colores[item.estado]}15`,
                                    borderRadius: 999,
                                    minWidth: 110,
                                }}
                                size="small"
                            />
                        </TableCell>
                        <TableCell sx={{textWrap:'nowrap'}} align="center">{item.fecha_cierre}</TableCell>    
                    </TableRow>
                ))
                }
                </TableBody>
 
            </Table>
        </TableContainer>
    )
}
 
