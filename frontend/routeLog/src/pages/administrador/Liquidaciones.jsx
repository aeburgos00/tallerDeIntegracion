import {
  Box,
  Skeleton,
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Typography,
} from "@mui/material"

import TablaPaginacionContenedor from "../../components/TablaPaginacionContenedor.jsx"
import TablaLiquidaciones from "../../components/tablasContenedor/TablaLiquidaciones.jsx"
import SummaryCard from "../../components/SummaryCard"

import FiltrosGenerico from "../../components/FiltrosGenerico.jsx"
import FiltroLiquidaciones from "../../components/filtros/FiltroLiquidaciones.jsx"

import {cardsLiquidacionesAdmin} from "../../components/datos/dataKPILiquidaciones.jsx";

import { 
  obtenerLiquidacionesTotales, 
} from "../../services/api.js"


import { useEffect, useState } from "react"

import useDateFilter from "../../hooks/useDateFilter"

export default function Liquidaciones() {

  const [liqTotales, setLiqTotales] = useState({})
  const [loading, setLoading] = useState(true)

  const [filtros, setFiltros] = useState({
    fechaEnvio: null,
    fechaLiquidacion: null,
    transportista: "",
    localidad: "",
    liquidado: "",
    montoDesde: "",
    montoHasta: ""
  })

  const filtrosVacios = {
    fechaEnvio: null,
    fechaLiquidacion: null,
    transportista: "",
    localidad: "",
    liquidado: "",
    montoDesde: "",
    montoHasta: ""
  }
 
  const [filtrosAplicados, setFiltrosAplicados] = useState(filtros)
  
  const [pagina, setPagina] = useState(1)
  const [filasPorPagina, setFilasPorPagina] = useState(10)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [liquidacionesMostradas, setLiquidacionesMostradas] = useState(0)

  const { fechaDesde, fechaHasta } = useDateFilter()

  const handleFilter = () => {
    setPagina(1)
    setFiltrosAplicados({ ...filtros })
  }

  const handleClear = () => {
    setFiltros({ ...filtrosVacios })
    setFiltrosAplicados({ ...filtrosVacios })
    setPagina(1)
  }

  useEffect(() => {
    const traerDatos = async () => {
      try {
        setLoading(true)
        
        const result = await obtenerLiquidacionesTotales(
          fechaDesde ? fechaDesde.format("YYYY-MM-DD") : null,
          fechaHasta ? fechaHasta.format("YYYY-MM-DD") : null
        )

        setLiqTotales(result.data?.[0] || {})

      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    traerDatos()
  }, [fechaDesde, fechaHasta])


  const kpis = cardsLiquidacionesAdmin.map(card => ({
    ...card,
    valor: card.id === "pct_paquetes_liquidados"
      ? Number(liqTotales[card.id] || 0) + "%"
      : card.id === "cantidad_envios"
        ? Number(liqTotales[card.id] || 0)
        : "$" + Number(liqTotales[card.id] || 0).toLocaleString("es-AR")
  }))

  return (

    <Box
    sx={{
      display:"flex",
      flexDirection:"column",
      gap: 2
    }}
    >
      {/* KPI x5 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg: "repeat(5, 1fr)"
          },
          gap: 2
        }}
      >
        {
          loading ?
            Array.from({ length: kpis.length }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                height={112}
              />
            ))
          :
            kpis.map((card, index) => (
              <SummaryCard 
                key={index}
                titulo={card.titulo}
                cantidad={card.valor}
                icono={card.icono}
                color={card.color}
                height={112}
              />
            ))
        }
      </Box>
      {/* Filtros */}
      <FiltrosGenerico
          onFilter={handleFilter}
          onClear={handleClear}
       >
          <FiltroLiquidaciones
            filtros={filtros}
            setFiltros={setFiltros}
          />
      </FiltrosGenerico>

      {/* Mostrado... */}
      <Typography sx={{
        color:"#777"
      }}>
        Mostrando {liquidacionesMostradas} liquidaciones
      </Typography>

      {/* Grilla */}
      <Box
        sx={{
          backgroundColor:"#fff",
          borderRadius:2,
          border:"1px solid #e5e7eb",
          boxShadow:
          "0 1px 2px rgba(0,0,0,0.04)"
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
          <TablaLiquidaciones
            filtros={filtrosAplicados}
            pagina={pagina}
            filasPorPagina={filasPorPagina}
            cantLiquidaciones={setLiquidacionesMostradas}
            onTotalPaginasChange={setTotalPaginas}
          />
        </TablaPaginacionContenedor>
      </Box>
    </Box>
  )
}