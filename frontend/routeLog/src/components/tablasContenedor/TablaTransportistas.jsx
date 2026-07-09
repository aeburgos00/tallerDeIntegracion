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
  obtenerTransportistas, 
  eliminarTransportista 
} from '../../services/api.js'

export default function TablaTransportistas ({
  cantTransportistas,
  filtros,
  pagina = 1,
  filasPorPagina = 10,
  onTotalPaginasChange,
  onEdit,
  refresh,
  onDeleteSuccess
}) {

  
  const [refreshBaja,setRefreshBaja] = useState(0)
  const [mensaje, setMensaje] = useState("")
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [transportistas, setTransportistas] = useState([]);
  const [openCancelar, setOpenCancelar] = useState(false)
  const [transportistaSeleccionado, setTransportistaSeleccionado] = useState(null)

  const handleAbrirDialogo = (transportista) => {
    setTransportistaSeleccionado(transportista)
    setOpenCancelar(true)
  }
  const handleCerrarDialogo = () => {
    setOpenCancelar(false)
    setTransportistaSeleccionado(null)
  }

  const noPuedeCancelar = (transportista) => {
    return (
      transportista.estado === "Inactivo"
    )
  }

  const obtenerMotivoCancelacion = (row) => {
    if (row.estado === "Inactivo")
      return "El transportista ya está dado de baja"
    return "Dar de baja"
  }

  const handleConfirmarCancelacion =
  async () => {
    try {
      await eliminarTransportista(transportistaSeleccionado)
      setMensaje("Transportista dado de baja correctamente")
      setError(false)
      handleCerrarDialogo()
      setRefreshBaja(prev => prev + 1)
      onDeleteSuccess?.();
    } catch(error) {
      setMensaje( error?.message || "Error al dar de baja al transportista" )
      setError(true)
    }
  }

  

  useEffect(() => {
    const obtenerDatos = async () => {
        try {
          setLoading(true)
          
          const result = await obtenerTransportistas(filtros);
          
          setTransportistas(result.data)

          cantTransportistas?.(result.data.length);
          
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
    refresh,
    refreshBaja,
    filasPorPagina,
    onTotalPaginasChange,
    cantTransportistas
  ])

  const transportistasPagina = transportistas.slice(
      (pagina - 1) * filasPorPagina,
      pagina * filasPorPagina
  );

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
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Código</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Nombre Completo</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Usuario</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>DNI</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Correo</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Fecha Alta</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Fecha Baja</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Estado</TableCell>
                    <TableCell align="center" sx={{textWrap:'nowrap'}}>Costo Envio</TableCell>
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
            transportistasPagina.map((item) => (
                 <TableRow
                key={item.id}
                hover
                >
                    <TableCell sx={{whiteSpace: "nowrap"}} align="center">{item.id}</TableCell>
                    <TableCell sx={{whiteSpace: "nowrap"}} >{item.nombre}</TableCell>
                    <TableCell sx={{textWrap:'nowrap'}}>{item.usuario}</TableCell>
                    <TableCell sx={{textWrap:'nowrap'}}>{item.dni}</TableCell>
                    <TableCell sx={{textWrap:'nowrap'}}>{item.correo}</TableCell>
                    <TableCell sx={{textWrap:'nowrap'}} align="center">{item.fecha_alta}</TableCell>
                    <TableCell sx={{textWrap:'nowrap'}} align="center">{item.fecha_baja || "-"}</TableCell>
                    <TableCell sx={{textWrap:'nowrap'}}>{item.estado}</TableCell>
                    <TableCell sx={{textWrap:'nowrap'}}> 
                        {Number(item.costo_envio || 0).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </TableCell>
                    <TableCell align="center">
                        <IconButton
                        color="primary"
                        onClick={() => onEdit(item.id)}
                        >
                            <EditIcon />
                        </IconButton>

                       <Tooltip title={obtenerMotivoCancelacion(item)}>
                        <span>
                          <IconButton
                          color="error"
                          disabled={noPuedeCancelar(item)}
                          onClick={() => {
                            setTransportistaSeleccionado(item.id)
                            handleAbrirDialogo(item.id)
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
              <DialogTitle>Baja de transportista</DialogTitle>

              <DialogContent>
                <DialogContentText>
                  ¿Está seguro que desea dar de baja al transportista {transportistaSeleccionado}?
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
                  Dar de baja
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
