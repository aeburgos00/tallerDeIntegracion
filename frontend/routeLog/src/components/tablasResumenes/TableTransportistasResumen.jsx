import { 
    TableContainer,
    Table, 
    TableHead, 
    TableRow, 
    TableCell, 
    TableBody,
    Box,
    LinearProgress,
    Typography,
    Skeleton
} from '@mui/material'

import { useEffect, useState } from 'react'

import {obtenerEnviosPorTransportistas} from '../../services/api.js'

import useDateFilter from '../../hooks/useDateFilter.js'

export default function TableTransportistasResumen() {
    
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

                const result = await obtenerEnviosPorTransportistas(
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
          minWidth: 650,
        }}>
            <TableHead 
            sx={{
                backgroundColor:"#F0EEE8",
            }}>
                <TableRow>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Transportista</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Envíos Totales</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Pendientes</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Entregados</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Fallidos</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>No Realizados</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>% Cumplimiento</TableCell>
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
            data.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} align="center">
                            No hay envíos para mostrar
                        </TableCell>
                    </TableRow>
            )
            :
            data.map((item) => (
                 <TableRow
                key={item.transportista}
                hover
                >
                    <TableCell sx={{textWrap:'nowrap'}} >{item.Transportista}</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>{item.EnviosTotales}</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>{item.EnviosPendientes}</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>{item.EnviosEntregados}</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>{item.EnviosFallidos}</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>{item.EnviosNoRealizados}</TableCell>
                    {/* CUMPLIMIENTO */}
                    <TableCell align="center">
                        <Box
                        sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        minWidth: 140,
                        }}
                        >
                        <LinearProgress
                        variant='determinate'
                        value={parseFloat(item.Cumplimiento)}
                        sx={{
                            flexGrow: 1,
                            height: 6,
                            borderRadius: 999,
                            backgroundColor: "#E5E7EB",

                            "& .MuiLinearProgress-bar": {
                            borderRadius: 999,
                            backgroundColor: 
                                item.Cumplimiento > 67 ? "#639922" : 
                                    item.Cumplimiento > 34 ? "#EF9F27" : "#D23B3B"  
                            }
                        }}
                        />
                        <Typography
                        sx={{
                            fontSize: 13,
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                        }}
                        >
                        {item.Cumplimiento}%
                        </Typography>
                    </Box>
                </TableCell>
              </TableRow>
            ))
            }            
          </TableBody>
        </Table>
    </TableContainer>
  )
}