import {
  Box,
  Skeleton,
} from "@mui/material"

import { useEffect, useState } from 'react'

import TableResumenCard from "../../components/TableResumenCard.jsx"
import SummaryCard from "../../components/SummaryCard"

import cardLiquidaciones from "../../components/datos/dataKPILiquidaciones.jsx";

import useDateFilter from '../../hooks/useDateFilter.js'

import { obtenerLiquidacionesTotales } from "../../services/api.js";

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
          fechaDesde? fechaDesde.format('YYYY-MM-DD'): null,
          fechaHasta? fechaHasta.format('YYYY-MM-DD'): null
        )
        
        setLiqTotales(liqTotResult.data[0])

      } catch (error) {
        console.error(error)
      } finally {
        setLoadingKPI(false)
      }
    }
    obtenerDatos()
  }, [fechaDesde,fechaHasta])

  const cards = cardLiquidaciones.map(card => ({
    ...card,
    cantidad: card.id === "pct_paquetes_liquidados"?
              Number(liqTotales[card.id] || 0) + "%"
              :
              card.id === "valor_total" || card.id === "valor_liquidado"?
              Number(liqTotales[card.id] || 0).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
              :
              Number(liqTotales[card.id] || 0)
  }))

  return (
    //Contenedor total
    <Box
    sx={{
      display:"flex",
      flexDirection:"column",
      gap: 2
    }}
    >
      {/* KPI Liquidaciones */}
      <Box 
      sx={{
        display:"grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          lg: "repeat(5, 1fr)"
        },
        gap:2
      }}
      >
        {
        loadingKPI?
        Array.from({ length: 5 }).map((_, index) => (
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
      <Box sx={{background:"#ff2233"}}>
      <h2>
        Filtros
      </h2>
      </Box>


      {/* Grilla */}
      <Box>
        {/* Grilla */}
        <TableResumenCard></TableResumenCard>
        <h3>Grilla que muestre todas las liquidaciones</h3>
        {/* Filtros y paginacion */}
        <Box sx={{
          display:"grid",
          gridTemplateColumns: "8fr 4fr",
          gap:2
        }}
        >
          <h3>Filas x pag</h3>
          <Box
          sx={{
            display:"flex",
            gap:4,
          }}
          >
            <p>Pagina 1 de 3</p>
            <p> ant </p>
            <p> 1 </p>
            <p> 2 </p>
            <p> 3 </p>
            <p> sig </p>
          </Box>
        </Box>
      </Box>
      <h3>Grilla que muestre todas las liquidaciones por transportista y semana</h3>

    </Box>
  )
}
