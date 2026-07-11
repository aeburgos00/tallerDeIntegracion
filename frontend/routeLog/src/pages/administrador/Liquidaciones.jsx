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

import {cardsLiquidacionesPagLiq} from "../../components/datos/dataKPILiquidaciones.jsx";

import { 
  obtenerLiquidacionesTotalesAdmin, 
} from "../../services/api.js"


import { useEffect, useState } from "react"

import useDateFilter from "../../hooks/useDateFilter"

export default function Liquidaciones() {
  const [loadingKPI, setLoadingKPI] = useState(true)

  const {
    fechaDesde,
    fechaHasta
  } = useDateFilter()

  const [liqTotales, setLiqTotales] = useState({});

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setLoadingKPI(true)
        
        const liqTotResult = await obtenerLiquidacionesTotalesAdmin(
          fechaDesde ? fechaDesde.format("YYYY-MM-DD") : null,
          fechaHasta ? fechaHasta.format("YYYY-MM-DD") : null
        )

        setLiqTotales(liqTotResult.data?.[0] || {})

      } catch (error) {
        console.error(error)
      } finally {
        setLoadingKPI(false)
      }
    }

    obtenerDatos()
  }, [fechaDesde, fechaHasta])

  const cards = cardsLiquidacionesPagLiq.map(card => {
    const esMonetario = card.id === "valor_total" || card.id === "pago_realizado" || card.id === "pago_pendiente"
 
    return {
      ...card,
      cantidad: esMonetario
        ? undefined
        : card.id === "pct_paquetes_liquidados"
          ? Number(liqTotales[card.id] || 0) + "%"
          : Number(liqTotales[card.id] || 0),
      valor: esMonetario
        ? Number(liqTotales[card.id] || 0).toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : undefined,
      descripcion: card.id === "pct_paquetes_liquidados" ? 
        "De un total de " + Number(liqTotales.cantidad_liquidaciones || 0)
        : ""
    }
  })

  const [filtros, setFiltros] = useState({
    fecha_alta: null,
    transportista: "",
    estado: "",
    montoDesde: "",
    montoHasta: ""
  })

  const filtrosVacios = {
    fecha_alta: null,
    transportista: "",
    estado: "",
    montoDesde: "",
    montoHasta: ""
  }
 
  const [filtrosAplicados, setFiltrosAplicados] = useState(filtros)
  
  const [pagina, setPagina] = useState(1)
  const [filasPorPagina, setFilasPorPagina] = useState(10)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [liquidacionesMostradas, setLiquidacionesMostradas] = useState(0)


  const handleFilter = () => {
    setPagina(1)
    setFiltrosAplicados({ 
      ...filtros, 
    fecha_alta: filtros.fecha_alta ? filtros.fecha_alta.format("YYYY-MM-DD") : null 
  })
  }

  const handleClear = () => {
    setFiltros({ ...filtrosVacios })
    setFiltrosAplicados({ ...filtrosVacios })
    setPagina(1)
  }

  return (

    <Box
    sx={{
      display:"flex",
      flexDirection:"column",
      gap: 2
    }}
    >
      {/* KPI liquidaciones */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg: "repeat(auto-fit, minmax(200px, 1fr))"
            },
          gap: 2
        }}
      >
        {
          loadingKPI ?
            Array.from({ length: cards.length }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                height={112}
              />
            ))
          :
            cards.map((card, index) => (
              <SummaryCard 
                key={index}
                titulo={card.titulo}
                cantidad={card.cantidad}
                valor={card.valor}
                descripcion={card.descripcion}
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

      {/* Grilla de Todas las Liquidaciones */}
      <Box
        sx={{
          backgroundColor:"#fff",
          borderRadius:2,
          border:"1px solid #e5e7eb",
          boxShadow:
          "0 1px 2px rgba(0,0,0,0.04)"
        }}>
          {/**
        <TableResumenCard></TableResumenCard>
        <h3>Grilla que muestre todas las liquidaciones</h3>  
        */}
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
          {/*
            <h3>Grilla que muestre todas las liquidaciones por transportista y semana</h3>
          */}
    </Box>
  )
}