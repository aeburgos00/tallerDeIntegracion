import {
  Box,
  Button,
  Skeleton,
  Typography,
  Snackbar,
  Alert
} from "@mui/material"

import DescargaIcon from '@mui/icons-material/ArrowDownward';
import NuevoIcon from '@mui/icons-material/Add';

import { useEffect, useState } from 'react'

import TablaPaginacionContenedor from "../../components/TablaPaginacionContenedor.jsx";
import TablaLocalidades from "../../components/tablasContenedor/TablaLocalidades.jsx";

import SummaryCard from "../../components/SummaryCard"

import FiltrosGenerico from "../../components/FiltrosGenerico.jsx"
import FiltroLocalidades from "../../components/filtros/FiltroLocalidades.jsx"

import cardsLocalidades from "../../components/datos/dataKPILocalidades.jsx"

import ABMLocalidades from "../../components/abm/ABMLocalidades.jsx";

import {
  obtenerLocalidadesTotales,
  exportarLocalidadesCSV
} from "../../services/api.js"

const filtrosVacios = {
  localidad: "",
  codigoPostal: "",
  estado: "",
  provincia: ""
}

export default function Localidades() {

  const [loadingKPI, setLoadingKPI] = useState(true)
  const [totales, setTotales] = useState({})

  const [filtros, setFiltros] = useState(filtrosVacios)
  const [filtrosAplicados, setFiltrosAplicados] = useState(filtrosVacios)

  const [pagina, setPagina] = useState(1)
  const [filasPorPagina, setFilasPorPagina] = useState(10)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [localidadesMostradas, setLocalidadesMostradas] = useState(0)

  const [openABM, setOpenABM] = useState(false)
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState(null)

  const [mensaje, setMensaje] = useState("")
  const [tipoMensaje, setTipoMensaje] = useState("success")

  const [refreshTabla, setRefreshTabla] = useState(0)

  const obtenerDatosKPI = async () => {
    try {
      setLoadingKPI(true)
      const result = await obtenerLocalidadesTotales()
      setTotales(result.data[0] || {})
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingKPI(false)
    }
  }

  useEffect(() => {
    obtenerDatosKPI()
  }, [refreshTabla])

  const handleNuevo = () => {
    setLocalidadSeleccionada(null)
    setOpenABM(true)
  }

  const handleEditar = (localidad) => {
    setLocalidadSeleccionada(localidad.id_loc)
    setOpenABM(true)
  }

  const handleSuccessABM = (msg) => {
    setMensaje(msg)
    setTipoMensaje("success")
    setRefreshTabla(prev => prev + 1)
  }

  const handleFilter = () => {
    setPagina(1)
    setFiltrosAplicados({ ...filtros })
  }

  const handleClear = () => {
    setFiltros({ ...filtrosVacios })
    setFiltrosAplicados({ ...filtrosVacios })
    setPagina(1)
  }

  const handleExportar = async () => {
    try {
      await exportarLocalidadesCSV(filtrosAplicados)
    } catch (error) {
      console.error(error)
    }
  }

  const loc = cardsLocalidades.map(e => {
    if (e.id === "costo_promedio") {
      return {
        ...e,
        cantidad: "$" + Number(totales.costo_promedio || 0).toLocaleString("es-AR", { maximumFractionDigits: 0 })
      }
    }
    return {
      ...e,
      cantidad: Number(totales[e.id]) || 0
    }
  })

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

      {/* KPI */}
      <Box sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" },
        gap: 2
      }}>
        {loadingKPI
          ? Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" height={112} />
          ))
          : loc.map((e, index) => (
            <SummaryCard
              key={index}
              titulo={e.titulo}
              cantidad={e.cantidad}
              descripcion={e.descripcion || ""}
              icono={e.icono}
              color={e.color}
              height={112}
            />
          ))
        }
      </Box>

      {/* Filtros */}
      <FiltrosGenerico onFilter={handleFilter} onClear={handleClear}>
        <FiltroLocalidades filtros={filtros} setFiltros={setFiltros} />
      </FiltrosGenerico>

      {/* Mostrado + Botones */}
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "center" }}>
        <Typography sx={{ color: "#777" }}>
          Mostrando {localidadesMostradas} localidades
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<DescargaIcon />}
            onClick={handleExportar}
            size="small"
            sx={{
              borderColor: "#65a30d", color: "#65a30d", background: "#fff",
              borderRadius: 2, textTransform: "none", whiteSpace: "nowrap",
              px: 1.5, height: 36, fontSize: 13
            }}
          >
            Exportar CSV
          </Button>

          <Button
            variant="contained"
            onClick={handleNuevo}
            startIcon={<NuevoIcon />}
            size="small"
            sx={{
              background: "#3b82f6", borderRadius: 2, textTransform: "none",
              whiteSpace: "nowrap", px: 1.5, height: 36, fontSize: 13
            }}
          >
            Nueva Localidad
          </Button>

          <ABMLocalidades
            open={openABM}
            onClose={() => setOpenABM(false)}
            idLocalidad={localidadSeleccionada}
            onSuccess={handleSuccessABM}
          />
        </Box>
      </Box>

      {/* Tabla */}
      <Box sx={{
        backgroundColor: "#fff", borderRadius: 2, border: "1px solid #e5e7eb",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
      }}>
        <TablaPaginacionContenedor
          pagina={pagina}
          filasPorPagina={filasPorPagina}
          totalPaginas={totalPaginas}
          onPaginaChange={setPagina}
          onFilasPorPaginaChange={(valor) => {
            setPagina(1)
            setFilasPorPagina(valor)
          }}
        >
          <TablaLocalidades
            filtros={filtrosAplicados}
            pagina={pagina}
            filasPorPagina={filasPorPagina}
            onTotalPaginasChange={setTotalPaginas}
            cantLocalidades={setLocalidadesMostradas}
            refresh={refreshTabla}
            onEdit={handleEditar}
            onActionSuccess={obtenerDatosKPI}
          />
        </TablaPaginacionContenedor>
      </Box>

      <Snackbar open={!!mensaje} autoHideDuration={4000} onClose={() => setMensaje("")}>
        <Alert severity={tipoMensaje}>{mensaje}</Alert>
      </Snackbar>

    </Box>
  )
}