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

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useEffect, useState } from "react";

import {
  obtenerTransportistas,
  eliminarTransportista,
} from "../../services/api";

const colores = {
  azul: "#3b82f6",
  gris: "#9ca3af",
};

export default function TablaTransportistas({
  filtros,
  filasPorPagina = 10,
  refresh,
  onEdit,
}) {
  const [loading, setLoading] = useState(true);

  const [transportistas, setTransportistas] = useState([]);

  const [refreshBaja, setRefreshBaja] = useState(0);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);

  const [openEliminar, setOpenEliminar] = useState(false);
  const [transportistaSeleccionado, setTransportistaSeleccionado] =
    useState(null);

  const handleAbrirDialogo = (transportista) => {
    setTransportistaSeleccionado(transportista);
    setOpenEliminar(true);
  };

  const handleCerrarDialogo = () => {
    setOpenEliminar(false);
    setTransportistaSeleccionado(null);
  };

  const handleEliminar = async () => {
    try {
      await eliminarTransportista(transportistaSeleccionado.id);

      setMensaje("Transportista eliminado correctamente");
      setError(false);

      setRefreshBaja((prev) => prev + 1);

      handleCerrarDialogo();
    } catch (err) {
      setMensaje(err?.message || "Error al eliminar el transportista");
      setError(true);
    }
  };

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setLoading(true);

        const result = await obtenerTransportistas({
          nombre: filtros.nombre,
          usuario: filtros.usuario,
          dni: filtros.dni,
          estado: filtros.estado,
          fechaAlta: filtros.fechaAlta
            ? filtros.fechaAlta.format("YYYY-MM-DD")
            : null,
        });

        setTransportistas(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    obtenerDatos();
  }, [filtros, refresh, refreshBaja]);

  return (
    <>
      <TableContainer
        sx={{
          width: "100%",
          overflowX: "auto",
        }}
      >
        <Table
          size="small"
          sx={{
            minWidth: 900,
          }}
        >
          <TableHead
            sx={{
              backgroundColor: "#F0EEE8",
            }}
          >
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Nombre</TableCell>
              <TableCell align="center">Usuario</TableCell>
              <TableCell align="center">DNI</TableCell>
              <TableCell align="center">Fecha Alta</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="center">Costo Envío</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading
              ? Array.from(new Array(filasPorPagina)).map((_, index) => (
                <TableRow key={index}>
                  {Array.from(new Array(8)).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton />
                    </TableCell>
                  ))}
                </TableRow>
              ))
              : transportistas.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.id}</TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {item.nombre}
                  </TableCell>

                  <TableCell>{item.usuario}</TableCell>

                  <TableCell>{item.dni}</TableCell>

                  <TableCell>{item.fecha_alta}</TableCell>

                  <TableCell>{item.estado}</TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    $
                    {Number(item.costo_envio || 0).toLocaleString("es-AR")}
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => onEdit(item.id)}
                    >
                      <EditIcon />
                    </IconButton>

                    <Tooltip title="Eliminar transportista">
                      <IconButton
                        color="error"
                        onClick={() => handleAbrirDialogo(item)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openEliminar}
        onClose={handleCerrarDialogo}
      >
        <DialogTitle>
          Eliminar transportista
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar al transportista{" "}
            <strong>{transportistaSeleccionado?.nombre}</strong>?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={handleCerrarDialogo}
            sx={{
              borderColor: colores.gris,
              color: colores.azul,
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Volver
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleEliminar}
            sx={{
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Eliminar
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
    </>
  );
}