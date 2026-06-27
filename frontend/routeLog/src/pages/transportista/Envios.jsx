import {
  Box,
  Skeleton,
  Typography,
  Snackbar,
  Alert
} from "@mui/material"

import { useEffect, useState } from "react"

import useAuth from "../../hooks/useAuth"
import FiltrosGenerico from "../../components/FiltrosGenericoMobile.jsx"
import FiltroEnvios from "../../components/filtros/FiltroEnviosTransportista.jsx"
import TablaPaginacionContenedor from "../../components/TablaPaginacionContenedor.jsx"
import TablaEnviosTransportista from "../../components/tablasContenedor/TablaEnviosTransportista.jsx"
import PanelDetalleEnvio from "../../components/abm/PanelDetalleEnvio.jsx"

import cardsEnvios from "../../components/datos/dataKPIEnvios.jsx"

import { obtenerEnviosPorTransportistaId } from "../../services/apiTransportistas.js"

import KPICardMobile from "../../components/KPICardMobile.jsx"

/*
const KPICardMobile = ({ titulo, cantidad, icono: Icono, color, esUltimo }) => (
  <Box sx={{
    background: "#fff",
    borderRadius: 3,
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    p: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 1,
    gridColumn: esUltimo ? "1 / -1" : "auto",
  }}>
    <Box sx={{
      width: 36,
      height: 36,
      borderRadius: 2,
      background: color + "20",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <Icono sx={{ fontSize: 20, color }} />
    </Box>
    <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#111827", lineHeight: 1 }}>
      {cantidad}
    </Typography>
    <Typography sx={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>
      {titulo}
    </Typography>
  </Box>
)*/

const filtrosIniciales = {
  fechaEnvio: null,
  cliente: "",
  direccion: "",
  localidad: "",
  estado: "",
}

export default function EnviosTransportista() {
  const { user } = useAuth()

  const [loadingKPI, setLoadingKPI] = useState(true)
  const [envios, setEnvios] = useState([])
  const [enviosTotales, setEnviosTotales] = useState({})
  const [filtros, setFiltros] = useState(filtrosIniciales)

  const [openPanel, setOpenPanel] = useState(false)
  const [envioSeleccionado, setEnvioSeleccionado] = useState(null)

  const [mensaje, setMensaje] = useState("")
  const [tipoMensaje, setTipoMensaje] = useState("success")

  const obtenerDatos = async (filtrosActivos = {}) => {
    try {
      setLoadingKPI(true)
      const result = await obtenerEnviosPorTransportistaId(user.id, filtrosActivos)
      const data = result.data ?? []
      setEnvios(data)

      setEnviosTotales({
        total: data.length,
        pendientes: data.filter(e => e.id_estado === 1).length,
        entregados: data.filter(e => e.id_estado === 2).length,
        visitas_fallidas: data.filter(e => e.id_estado === 3).length,
        no_visitados: data.filter(e => e.id_estado === 4).length,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingKPI(false)
    }
  }

  useEffect(() => {
    if (user?.id) obtenerDatos(filtros)
  }, [user])

  const handleFilter = () => obtenerDatos(filtros)

  const handleClear = () => {
    setFiltros(filtrosIniciales)
    obtenerDatos(filtrosIniciales)
  }

  const handleVerMas = (envio) => {
    setEnvioSeleccionado(envio)
    setOpenPanel(true)
  }

  const handleSuccessPanel = (msg) => {
    setMensaje(msg)
    setTipoMensaje("success")
    obtenerDatos(filtros)
  }

  const cards = cardsEnvios.map(card => ({
    ...card,
    cantidad: Number(enviosTotales[card.id]) || 0,
    descripcion: card.id === "total"
      ? ""
      : enviosTotales.total > 0
        ? `${Math.round((enviosTotales[card.id] / enviosTotales.total) * 100)}% del total`
        : ""
  }))

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pb: 4 }}>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
        {loadingKPI
          ? Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={110} />
          ))
          : cards.map((card, i) => (
            <KPICardMobile
              key={i}
              titulo={card.titulo}
              cantidad={card.cantidad}
              icono={card.icono}
              color={card.color}
              esUltimo={i === cards.length - 1 && cards.length % 2 !== 0}
            />
          ))}
      </Box>

      <FiltrosGenerico onFilter={handleFilter} onClear={handleClear}>
        <FiltroEnvios filtros={filtros} setFiltros={setFiltros} />
      </FiltrosGenerico>

      <Typography sx={{ color: "#777", fontSize: 13, textAlign: "center" }}>
        Mostrando {cards[0].cantidad} envíos
      </Typography>

      <Box sx={{
        backgroundColor: "#fff",
        borderRadius: 2,
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}>
        <TablaPaginacionContenedor>
          <TablaEnviosTransportista envios={envios} onVerMas={handleVerMas} />
        </TablaPaginacionContenedor>
      </Box>

      <PanelDetalleEnvio
        open={openPanel}
        onClose={() => setOpenPanel(false)}
        envio={envioSeleccionado}
        onSuccess={handleSuccessPanel}
      />

      <Snackbar
        open={!!mensaje}
        autoHideDuration={4000}
        onClose={() => setMensaje("")}
      >
        <Alert severity={tipoMensaje}>
          {mensaje}
        </Alert>
      </Snackbar>

    </Box>
  )
}