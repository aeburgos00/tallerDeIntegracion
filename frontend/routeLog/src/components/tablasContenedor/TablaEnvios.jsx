import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

const colores = {
  azul: "#3b82f6",
  gris: "#9ca3af",
}

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useEffect, useState } from 'react'
import {
  obtenerEnvios, 
  cancelarEnvio 
} from '../../services/api.js'

import useDateFilter from "../../hooks/useDateFilter.js";

export default function TablaEnvios ({
  filasPorPagina = 0,
  onEdit,
  refresh
}) {

  const {
    fechaDesde,
    fechaHasta
  } = useDateFilter()
  
  const [refreshBaja,setRefreshBaja] = useState(0)
  const [mensaje, setMensaje] = useState("")
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [envios, setEnvios] = useState({});
  const [openCancelar, setOpenCancelar] = useState(false)
  const [envioSeleccionado, setEnvioSeleccionado] = useState(null)

  const handleAbrirDialogo = (envio) => {
    setEnvioSeleccionado(envio)
    setOpenCancelar(true)
  }
  const handleCerrarDialogo = () => {
    setOpenCancelar(false)
    setEnvioSeleccionado(null)
  }

  const noPuedeCancelar = (envio) => {
    return (
      ( Number(envio.liquidacion) &&
      Number(envio.liquidacion) !== 0 ) ||
      envio.estado == 'Entregado' ||
      envio.estado == 'Cancelado'
    )
  }

  const obtenerMotivoCancelacion = (row) => {
    if (Number(row.liquidacion) && Number(row.liquidacion)!== 0)
      return "El envío fue liquidado"
    if (row.estado === 'Entregado')
      return "El envío fue entregado"
    if (row.estado === 'Cancelado')
      return "El envío ya está cancelado"
    return "Cancelar envío"
  }

  const handleConfirmarCancelacion =
  async () => {
    try {
      await cancelarEnvio(envioSeleccionado)
      setMensaje("Envío cancelado correctamente")
      setError(false)
      handleCerrarDialogo()
      setRefreshBaja(prev => prev + 1)
    } catch(error) {
      setMensaje( error?.message || "Error al cancelar el envío" )
      setError(true)
    }
  }

  // const handleCancelar = async(id) => {
  //   try {
  //     await cancelarEnvio(id)
  //   } catch(error) {
  //     console.error(error)
  //   } 
  // }

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
  },[fechaDesde,fechaHasta,refresh,refreshBaja])

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
                        onClick={() => onEdit(item.id_envio)}
                        >
                            <EditIcon />
                        </IconButton>

                       <Tooltip title={obtenerMotivoCancelacion(item)}>
                        <span>
                          <IconButton
                          color="error"
                          disabled={noPuedeCancelar(item)}
                          onClick={() => {
                            //handleCancelar(item.id_envio)
                            setEnvioSeleccionado(item.id_envio)
                            handleAbrirDialogo(item.id_envio)
                          }}
                          >
                              <DeleteIcon />
                          </IconButton>
                         </span>
                      </Tooltip>

                      <Dialog
                        open={openCancelar}
                        onClose={handleCerrarDialogo}
                      >
                        <DialogTitle>
                          Cancelar envío
                        </DialogTitle>

                        <DialogContent>
                          <DialogContentText>
                            ¿Está seguro que desea cancelar el envío {envioSeleccionado}?
                          </DialogContentText>
                        </DialogContent>

                        <DialogActions>
                          <Button
                          variant="outlined"
                          onClick={handleCerrarDialogo}
                          sx={{
                          borderColor:colores.gris,
                          color:colores.azul,
                          borderRadius:2,
                          textTransform:"none",
                          }}
                          >
                            Volver
                          </Button>

                          <Button
                          variant="contained"
                          color="error"
                          sx={{
                          borderRadius:2,
                          textTransform: "none"
                          }}
                          onClick={handleConfirmarCancelacion}
                          >
                            Cancelar envío
                          </Button>
                        </DialogActions>
                      </Dialog>
                      
                      <Snackbar
                      open={!!mensaje}
                      autoHideDuration={4000}
                      onClose={() => setMensaje("")}
                      >
                        <Alert severity={error ? "error" : "success"}>
                          {mensaje}
                        </Alert>
                      </Snackbar>

                    </TableCell>
            </TableRow>
            ))
            }
            </TableBody>

        </Table>
    </TableContainer>
  )
}
