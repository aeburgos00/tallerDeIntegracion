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
import {obtenerLocalidades} from '../services/api.js'

export default function TablaLocalidades ({
    filasPorPagina = 0
}) {

  const [loading, setLoading] = useState(true)

  const [localidades, setLocalidades] = useState([]);
  useEffect(() => {
    const obtenerDatos = async () => {
        try {
            setLoading(true)
            const result = await obtenerLocalidades();
            setLocalidades(result.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }
  obtenerDatos()
  },[])

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
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Localidad</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Código Postal</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Provincia</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Costo Envío</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Fecha Alta</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Fecha Baja</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Estado</TableCell>
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
                  {Array.from(new Array(8)).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton
                        variant="text"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            :
            localidades.map((item) => (
                 <TableRow
                key={item.id_loc}
                hover
                >
                    <TableCell sx={{whiteSpace: "nowrap"}} >{item.nombre}</TableCell>
                    <TableCell sx={{whiteSpace: "nowrap"}} >{item.codigo_postal}</TableCell>
                    <TableCell sx={{textWrap:'nowrap'}}>{item.provincia}</TableCell>
                    <TableCell sx={{textWrap:'nowrap'}}> $ {Number(item.costo_envio || 0).toLocaleString('es-AR')} </TableCell>
                    <TableCell sx={{whiteSpace: "nowrap"}} >{item.fecha_alta}</TableCell>
                    <TableCell sx={{whiteSpace: "nowrap"}} >{item.fecha_baja || "-"}</TableCell>
                    <TableCell sx={{whiteSpace: "nowrap"}} >{item.estado}</TableCell>
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

