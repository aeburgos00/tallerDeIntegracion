import { 
    TableContainer,
    Table, 
    TableHead, 
    TableRow, 
    TableCell, 
    TableBody,
    Skeleton
} from '@mui/material'

import { useEffect, useState } from 'react'

import { obtenerLiquidacionesTransportistas } from '../services/api.js'
import useDateFilter from '../hooks/useDateFilter.js'



export default function TableLiquidacionesResumen({transportista}) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const { fechaDesde, fechaHasta } = useDateFilter()
    useEffect(() => {
        const obtenerDatos  = async () => {
            try {
            setLoading(true)

            const result = await obtenerLiquidacionesTransportistas(
                fechaDesde ? fechaDesde.format("YYYY-MM-DD") : null,
                fechaHasta ? fechaHasta.format("YYYY-MM-DD") : null
            )
            
            const lista = result.data || result

            if (!lista || lista.length === 0) {
                setData([])
            } else {
                setData(lista)
            }

            } catch (error) {
            console.error(error)
            } finally {
            setLoading(false)
            }
        }

        obtenerDatos()
        }, [fechaDesde, fechaHasta] )
  
    return (
        <TableContainer 
        sx={{
            borderRadius: 3,
            width: "100%",
            overflowX: "auto",
        }}>
            <Table size="small"
            sx={{
                minWidth: 650
            }}>
                
                {/* HEADER */}
                <TableHead sx={{ backgroundColor:"#F0EEE8" }}> 
                    <TableRow>
                        <TableCell align="center">Transportista</TableCell>
                        <TableCell align="center">Envíos</TableCell>
                        <TableCell align="center">Importe</TableCell>
                    </TableRow>
                </TableHead>

                {/* BODY */}
                <TableBody sx={{ backgroundColor:"#fff" }}>
                {
                loading ? 
                Array.from(new Array(4)).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell><Skeleton /></TableCell>
                    </TableRow>
                ))
                :
                /*Si no hay datos en la fecha, muestra un mensaje*/ 
                data.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={3} align="center">
                            No hay liquidaciones para mostrar
                        </TableCell>
                    </TableRow>
                ):
                data
                    .filter(item => {
                        if (!transportista || transportista === "Todos") return true
                        return `Transportista ${item.id_transportista}` === transportista
                    })
                    .map((item, index) => (
                    <TableRow key={index} hover>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {`Transportista ${item.id_transportista}`}
                        </TableCell>
                        <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                        {item.envios_totales}
                        </TableCell>
                        <TableCell align="center">
                        $ {Number(item.importe_total || 0).toLocaleString('es-AR')}
                        </TableCell>
                    </TableRow>
                ))
                }
                </TableBody>

            </Table>
        </TableContainer>
    )
}

