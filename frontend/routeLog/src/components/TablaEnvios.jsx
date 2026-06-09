import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Skeleton
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useEffect, useState } from 'react'
import {obtenerEnvios} from '../services/api.js'

import useDateFilter from "../hooks/useDateFilter.js";

export default function TablaEnvios ({
  filasPorPagina = 0
}) {

  const {
    fechaDesde,
    fechaHasta
  } = useDateFilter()

  const [loading, setLoading] = useState(true)
  
  const [envios, setEnvios] = useState({});
  useEffect(() => {
    const obtenerDatos = async () => {
        try {
          setLoading(true)
          const result = await obtenerEnvios(
            fechaDesde? fechaDesde.format('YYYY-MM-DD'): null,
            fechaHasta? fechaHasta.format('YYYY-MM-DD'): null
          );
          setEnvios(result.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }
  obtenerDatos()
  },[fechaDesde,fechaHasta])

  return (
    <TableContainer 
    sx={{
        width: "100%",
        overflowX: "auto",
    }}>
        <Table
        size="small"
        sx={{
          minWidth: 900
        }}>
            <TableHead
            sx={{
                backgroundColor:"#F0EEE8",
            }}>
                <TableRow>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Cod. Envío</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Fecha Envío</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Cliente</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Dirección</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Localidad</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Transportista</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Estado</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Tarifa</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Liquidación</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Acciones</TableCell>
                </TableRow>
            </TableHead>

            <TableBody
            sx={{
                backgroundColor:"#fff"
            }}>
            {
            loading? 
            Array.from(new Array(filasPorPagina)).map((_, index) => (
                <TableRow key={index}>
                  {Array.from(new Array(10)).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton
                        variant="text"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            :
            envios.map((item) => (
                 <TableRow
                key={item.id_envio}
                hover
                >
                    <TableCell sx={{whiteSpace: "nowrap"}} >{item.id_envio}</TableCell>
                    <TableCell sx={{whiteSpace: "nowrap"}} >{item.fecha_envio}</TableCell>
                    <TableCell sx={{textWrap:'nowrap'}}>{item.cliente}</TableCell>
                    <TableCell sx={{textWrap:'nowrap'}}>{item.direccion}</TableCell>
                    <TableCell sx={{textWrap:'nowrap'}}>{item.localidad}</TableCell>
                    <TableCell sx={{textWrap:'nowrap'}}>{item.transportista}</TableCell>
                    <TableCell sx={{textWrap:'nowrap'}}>{item.estado}</TableCell>
                    <TableCell sx={{textWrap:'nowrap'}}> $ {Number(item.tarifa || 0).toLocaleString('es-AR')} </TableCell>
                    <TableCell sx={{textWrap:'nowrap'}}> $ {Number(item.liquidacion || 0).toLocaleString('es-AR')} </TableCell>                    
                    <TableCell align="center">
                        <IconButton
                        color="primary"
                        //onClick={() => onEdit(item)}
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                        color="error"
                        //onClick={() => onDelete(item)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </TableCell>
            </TableRow>
            ))
            }
            </TableBody>

        </Table>
    </TableContainer>
  )
}
