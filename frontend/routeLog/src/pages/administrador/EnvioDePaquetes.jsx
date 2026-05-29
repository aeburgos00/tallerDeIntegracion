import {
  Box,
  Button,
  Skeleton,
} from "@mui/material"

import TableResumenCard from "../../components/TableResumenCard.jsx"
import SummaryCard from "../../components/SummaryCard"

import cardsEnvios from "../../components/dataKPIEnvios.jsx";

import { useEffect, useState } from 'react'

import { obtenerEnviosTotales } from '../../services/api.js'

import useDateFilter from '../../hooks/useDateFilter.js'

export default function EnvioDePaquetes() {
  const [loadingEnviosTotales, setLoadingEnviosTotales] = useState(true)
  
  const [enviosTotales, setEnviosTotales] = useState({});

  const {
    fechaDesde,
    fechaHasta
  } = useDateFilter()

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setLoadingEnviosTotales(true)

        const enviosResult = await obtenerEnviosTotales(
          fechaDesde? fechaDesde.format('YYYY-MM-DD'): null,
          fechaHasta? fechaHasta.format('YYYY-MM-DD'): null
        )
        setEnviosTotales(enviosResult.data[0])

      } catch (error) {
        console.error(error)
      } finally {
        setLoadingEnviosTotales(false)
      }
    }
    obtenerDatos()
  }, [fechaDesde,fechaHasta])

  const cards = cardsEnvios.map(card => ({
    ...card,
    cantidad: Number(enviosTotales[card.id]) || 0,
    descripcion: card.id === "total"? 
                  "": 
                  enviosTotales.total > 0 ? 
                    `${Math.round(
                         (enviosTotales[card.id] / enviosTotales.total) * 100
                      )}% del total`
                    : ""
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
      {/* KPI Envios */}
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
        loadingEnviosTotales?
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


      {/* Mostrado... + SVC + ABM */}
      <Box sx={{
        display:"grid",
        gridTemplateColumns: "8fr 2fr 2fr",
        gap:2
      }}
      >
        <h3>Mostrando 111</h3>
        {/* BOTONES */}
        <Box
        sx={{
          display:"flex",
          gap:2
        }}
        >
          <Button>Exportar SVC</Button>
          <Button>Nuevo envío</Button>
        </Box>
      </Box>

      {/* Grilla */}
      <Box>
        {/* Grilla */}
        <TableResumenCard></TableResumenCard>
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

    </Box>
  )
}
