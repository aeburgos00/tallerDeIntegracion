import { useState } from "react"
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material"

import TableResumenCard from "../../components/TableResumenCard.jsx"
import SummaryCard from "../../components/SummaryCard.jsx"
import TransportistasTotales from "../../components/TransportistasTotales.jsx"
import AbcIcon from '@mui/icons-material/Abc';

const kpi = [
  { "titulo": "KP1" },
  { "titulo": "KP2" },
  { "titulo": "KP3" },
  { "titulo": "KP4" }
]

export default function Transportistas() {

  const fechaActual = new Date().toLocaleDateString("es-AR", {
    day: "2-digit", month: "2-digit", year: "numeric"
  })

  const [modalAbierto, setModalAbierto] = useState(false)
  const [transportistaFiltro, setTransportistaFiltro] = useState("")
  const [formulario, setFormulario] = useState({
    nombre: "", apellido: "", tarifa: ""
  })

  const handleAbrir = () => setModalAbierto(true)
  const handleCerrar = () => {
    setModalAbierto(false)
    setFormulario({ nombre: "", apellido: "", tarifa: "" })
  }
  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }
  const handleGuardar = () => {
    console.log("Nuevo transportista:", { ...formulario, fecha_creacion: fechaActual })
    handleCerrar()
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

      {/* KPI x4 */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
        {kpi.map((e) => (
          <SummaryCard
            titulo={e.titulo}
            cantidad={"0"}
            descripcion={""}
            icono={AbcIcon}
          />
        ))}
      </Box>

      {/* Filtros */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <TransportistasTotales
          value={transportistaFiltro}
          onChange={(e) => setTransportistaFiltro(e.target.value)}
        />
      </Box>

      {/* Mostrado + CSV + ABM */}
      <Box sx={{ display: "grid", gridTemplateColumns: "8fr 2fr 2fr", gap: 2 }}>
        <h3>Mostrando 111</h3>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button>Exportar CSV</Button>
          <Button variant="contained" onClick={handleAbrir}>
            Nuevo Transportista
          </Button>
        </Box>
      </Box>

      {/* Grilla */}
      <Box>
        <TableResumenCard />
        <Box sx={{ display: "grid", gridTemplateColumns: "8fr 4fr", gap: 2 }}>
          <h3>Filas x pag</h3>
          <Box sx={{ display: "flex", gap: 4 }}>
            <p>Pagina 1 de 3</p>
            <p>ant</p><p>1</p><p>2</p><p>3</p><p>sig</p>
          </Box>
        </Box>
      </Box>

      {/* Modal */}
      <Dialog open={modalAbierto} onClose={handleCerrar} fullWidth maxWidth="sm">
        <DialogTitle>Nuevo Transportista</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Nombre" name="nombre" value={formulario.nombre} onChange={handleChange} fullWidth />
          <TextField label="Apellido" name="apellido" value={formulario.apellido} onChange={handleChange} fullWidth />
          <TextField label="Tarifa ($)" name="tarifa" value={formulario.tarifa} onChange={handleChange} inputProps={{ min: 0, step: "any" }} fullWidth />
          <TextField label="Fecha de creación" value={fechaActual} fullWidth disabled
            sx={{ "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "gray" } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCerrar} color="error">Cancelar</Button>
          <Button onClick={handleGuardar} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>

    </Box>
  )
}