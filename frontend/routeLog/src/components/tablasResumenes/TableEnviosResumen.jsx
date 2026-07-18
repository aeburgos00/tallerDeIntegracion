import { 
    TableContainer,
    Table, 
    TableHead, 
    TableRow, 
    TableCell, 
    TableBody,
    Chip,
    Skeleton
} from '@mui/material'

const colors = {
    Pendiente: "#3b82f6",
    Entregado: "#639922",
    "Visita Fallida": "#ef4444",
    "No Visitado": "#f59e0b"
}

import { useEffect, useState } from 'react'
import {obtenerEnviosRecientes} from '../../services/api.js'
import useDateFilter from '../../hooks/useDateFilter.js'

export default function TableEnviosResumen() {
    
    const {
        fechaDesde,
        fechaHasta
    } = useDateFilter()

    const [loading, setLoading] = useState(true)

    const [data, setData] = useState([]);
    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                setLoading(true)

                const result = await obtenerEnviosRecientes(
                    fechaDesde? fechaDesde.format('YYYY-MM-DD'): null,
                    fechaHasta? fechaHasta.format('YYYY-MM-DD'): null
                );
                setData(result.data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        obtenerDatos()
    }, [fechaDesde,fechaHasta])

    const envios = data.map(e => ({
        ...e,
        color: colors[e.estado] || "#0e0e0e"
    }))

    return (
    <TableContainer 
    sx={{
        borderRadius: 3,
        width: "100%",
        overflowX: "auto",
        maxHeight: 182
    }}>
        <Table size="small" 
        sx={{
          minWidth: 900
        }}>
            <TableHead 
            sx={{
                backgroundColor:"#F0EEE8",
            }}>
                <TableRow>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>ID Envío</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Fecha Envío</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Cliente</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Dirección</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Transportista</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Tarifa</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Estado</TableCell>
            </TableRow>
          </TableHead>

          <TableBody 
          sx={{
            backgroundColor:"#fff"
            }}>
            
           {
            loading? 
            Array.from(new Array(4)).map((_, index) => (
                <TableRow key={index}>
                  {Array.from(new Array(7)).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton
                        variant="text"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            :
            envios.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} align="center">
                            No hay envíos para mostrar
                        </TableCell>
                    </TableRow>
            )
            :
            envios.map((item) => (
                 <TableRow
                key={item.idEnvio}
                hover
                >
                    <TableCell align="center" sx={{whiteSpace: "nowrap"}} >{item.id_envio}</TableCell>
                    <TableCell align="center" sx={{whiteSpace: "nowrap"}} >{item.fecha_envio}</TableCell>
                    <TableCell sx={{textWrap:'nowrap'}}>{item.cliente}</TableCell>
                    <TableCell sx={{
                            maxWidth: 220,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                                }} >{item.direccion}</TableCell>
                    <TableCell sx={{textWrap:'nowrap'}}>{item.transportista}</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}> $ {Number(item.tarifa || 0).toLocaleString('es-AR')} </TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>
                        <Chip size="small"
                            label={item.estado}
                            sx={{
                                color: item.color,
                                fontWeight: 500,
                                backgroundColor: `${item.color}15`,
                                borderRadius: 999,
                                minWidth: 110
                            }}
                        />
                    </TableCell>
            </TableRow>
            ))
            }
            </TableBody>          
        </Table>
    </TableContainer>
  )
}