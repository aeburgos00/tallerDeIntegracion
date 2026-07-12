import {
  Box,
  Button,
  Skeleton,
  Typography,
} from "@mui/material"

import DescargaIcon from '@mui/icons-material/ArrowDownward';

import TablaPaginacionContenedor from "../../components/TablaPaginacionContenedor.jsx"
import TablaLiquidaciones from "../../components/tablasContenedor/TablaLiquidaciones.jsx"
import SummaryCard from "../../components/SummaryCard"

import FiltrosGenerico from "../../components/FiltrosGenerico.jsx"
import FiltroLiquidaciones from "../../components/filtros/FiltroLiquidaciones.jsx"

import {cardLiquidaciones} from "../../components/datos/dataKPILiquidaciones.jsx";

import { 
  obtenerLiquidacionesTotales, 
  exportarLiquidacionesCSV
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
        
        const liqTotResult = await obtenerLiquidacionesTotales(
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

  const cards = cardLiquidaciones.map(card => ({
      ...card,
      cantidad: card.id === "total_liquidado"?
              Number(liqTotales[card.id] || 0).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
              :
              Number(liqTotales[card.id] || 0)
    }
  ))

  const [filtros, setFiltros] = useState({
    transportista: "",
    estado: "",
    montoDesde: "",
    montoHasta: ""
  })

  const filtrosVacios = {
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
    setFiltrosAplicados({ ...filtros })
  }

  const handleClear = () => {
    setFiltros({ ...filtrosVacios })
    setFiltrosAplicados({ ...filtrosVacios })
    setPagina(1)
  }

  const handleExportar = async () => {
    try {
      await exportarLiquidacionesCSV(
        fechaDesde.format("YYYY-MM-DD"),
        fechaHasta.format("YYYY-MM-DD"),
        filtrosAplicados
      )
    } catch (error){
      console.error(error)
    } 
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
            lg: "repeat(4, 1fr)"
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

      {/* Mostrando x liquidaciones... */}
      {/* Boton Exportar CSV */}

      <Box sx={{
        display:"flex",
        justifyContent:"space-between",
        gap:2,
        alignItems:"center",
      }}
      >
      <Typography sx={{
        color:"#777"
      }}>
        Mostrando {liquidacionesMostradas} liquidaciones
      </Typography>

        <Button 
          variant="outlined"
          onClick={handleExportar}
          startIcon={<DescargaIcon />}
          size="small"
          sx={{
            borderColor:"#65a30d",
            color:"#65a30d",
            background:"#fff",
            borderRadius:2, 
            textTransform:"none",
            whiteSpace:"nowrap",
            px:1.5,
            height:36, 
            fontsize:13
          }}>
            Exportar CSV
        </Button>
      </Box>
      
      {/* Grilla de Liquidaciones */}
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
