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
  Chip,
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

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const coloresEstados = {
    "Pendiente" : "#3b82f6" ,
    "Entregado" : "#65a30d",
    "Visita Fallida" : "#ef4444",
    "No Visitado" : "#f59e0b",
    "Cancelado" : "#333"
}

export default function TablaEnvios ({
  cantEnvios,
  filtros,
  pagina = 1,
  filasPorPagina = 10,
  onTotalPaginasChange,
  onEdit,
  refresh,
  onDeleteSuccess
}) {

  const {
    fechaDesde,
    fechaHasta
  } = useDateFilter()
  
  const [refreshBaja,setRefreshBaja] = useState(0)
  const [mensaje, setMensaje] = useState("")
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [envios, setEnvios] = useState([]);
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

  const hoy = dayjs().startOf('day');

  const esEnvioAnterior = (envio) => dayjs(envio.fecha_envio, "DD/MM/YYYY").isBefore(hoy);

  const noPuedeEditar = (envio) => esEnvioAnterior(envio);

  const obtenerMotivoEdicion = (envio) =>
        esEnvioAnterior(envio)
          ? "No se pueden modificar envíos anteriores a hoy"
          : "Modificar envío";

  const noPuedeCancelar = (envio) => {
    return (
      ( Number(envio.liquidacion) &&
      Number(envio.liquidacion) !== 0 ) ||
      envio.estado == 'Entregado' ||
      envio.estado == 'Cancelado' ||
      esEnvioAnterior(envio)
    )
  }

  const obtenerMotivoCancelacion = (row) => {
    if (Number(row.liquidacion) && Number(row.liquidacion)!== 0)
      return "El envío fue liquidado"
    if (row.estado === 'Entregado')
      return "El envío fue entregado"
    if (row.estado === 'Cancelado')
      return "El envío ya está cancelado"
    if ( esEnvioAnterior(row) )
      return "No se puede cancelar envíos anteriores a hoy"
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
      onDeleteSuccess?.();
    } catch(error) {
      setMensaje( error?.message || "Error al cancelar el envío" )
      setError(true)
    }
  }

  useEffect(() => {
    const obtenerDatos = async () => {
        try {
          setLoading(true)
          
          const result = await obtenerEnvios(
            fechaDesde? fechaDesde.format('YYYY-MM-DD'): null,
            fechaHasta? fechaHasta.format('YYYY-MM-DD'): null,
            filtros
          );
          
          setEnvios(result.data)

          cantEnvios?.(result.data.length);
          
          const totalPaginas = Math.max(
              1,
              Math.ceil(result.data.length / filasPorPagina)
          );

          onTotalPaginasChange?.(totalPaginas);

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }
  obtenerDatos()
  },[
    filtros,
    fechaDesde,
    fechaHasta,
    refresh,
    refreshBaja,
    filasPorPagina,
    onTotalPaginasChange,
    cantEnvios
  ])

  const enviosPagina = envios.slice(
      (pagina - 1) * filasPorPagina,
      pagina * filasPorPagina
  );

  return (
    <TableContainer 
    sx={{
        width: "100%",
        overflowX: "auto",
        overflowY: "auto",
        maxHeight: 568
    }}>
        <Table
        size="small"
        sx={{
          minWidth: 900,
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
                  {Array.from(new Array(9)).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton
                        variant="text"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            :
            enviosPagina.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={9} align="center">
                            No hay envíos para mostrar
                        </TableCell>
                    </TableRow>
            )
            :
            enviosPagina.map((item) => (
                 <TableRow
                key={item.id_envio}
                hover
                >
                    <TableCell sx={{whiteSpace: "nowrap"}} align="center">{item.id_envio}</TableCell>
                    <TableCell sx={{whiteSpace: "nowrap"}} align="center" >{item.fecha_envio}</TableCell>
                    <TableCell sx={{textWrap:'nowrap'}}>{item.cliente}</TableCell>
                    <TableCell sx={{textWrap:'nowrap'}}>{item.direccion}</TableCell>
                    <TableCell sx={{textWrap:'nowrap'}}>{item.localidad}</TableCell>
                    <TableCell sx={{textWrap:'nowrap'}}>{item.transportista}</TableCell>
                    <TableCell sx={{textWrap:'nowrap'}} align="center">
                        <Chip
                            label={item.estado}
                            sx={{
                                color: coloresEstados[item.estado],
                                fontWeight: 700,
                                backgroundColor: `${coloresEstados[item.estado]}15`,
                                borderRadius: 999,
                                minWidth: 110,
                            }}
                            size="small"
                        />
                    </TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}> $ {Number(item.tarifa || 0).toLocaleString('es-AR')} </TableCell>                 
                    <TableCell align="center">
                        <Tooltip 
                        title={obtenerMotivoEdicion(item)}
                        >
                        <span>
                          <IconButton
                          color="primary"
                          disabled={noPuedeEditar(item)}
                          onClick={() => onEdit(item.id_envio)}
                          >
                              <EditIcon />
                          </IconButton>
                        </span>
                        </Tooltip>

                        <Tooltip title={obtenerMotivoCancelacion(item)}>
                        <span>
                          <IconButton
                          color="error"
                          disabled={noPuedeCancelar(item)}
                          onClick={() => {
                            setEnvioSeleccionado(item.id_envio)
                            handleAbrirDialogo(item.id_envio)
                          }}
                          >
                              <DeleteIcon />
                          </IconButton>
                         </span>
                      </Tooltip>
                    </TableCell>
            </TableRow>
            ))
            }
            </TableBody>

            <Dialog
              open={openCancelar}
              onClose={handleCerrarDialogo}
            >
              <DialogTitle>Cancelar envío</DialogTitle>

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

        </Table>
    </TableContainer>
  )
}
