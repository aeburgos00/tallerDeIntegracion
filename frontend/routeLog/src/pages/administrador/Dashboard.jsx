import {
  Box,
  Skeleton
} from "@mui/material";

import { useEffect, useState } from 'react'

import cardsEnvios from "../../components/datos/dataKPIEnvios.jsx";
import cardsLiquidaciones from "../../components/datos/dataKPILiquidaciones.jsx";

import SummaryCard from "../../components/SummaryCard.jsx";
import StatusCard from "../../components/StatusCard";
import TableResumenCard from '../../components/TableResumenCard.jsx';
import TableTransportistasResumen from "../../components/tablasResumenes/TableTransportistasResumen.jsx";
import TableEnviosResumen from "../../components/tablasResumenes/TableEnviosResumen";

import useDateFilter from '../../hooks/useDateFilter.js'

import { obtenerEnviosTotales, obtenerLiquidacionesTotales } from '../../services/api.js'

export default function Dashboard() {

  const [loadingEnviosTotales, setLoadingEnviosTotales] = useState(true)
  const [loadingLiqTotales, setLoadingLiqTotales] = useState(true)

  const [enviosTotales, setEnviosTotales] = useState({});
  const [liqTotales, setLiqTotales] = useState({})

  const {
    fechaDesde,
    fechaHasta
  } = useDateFilter()

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setLoadingEnviosTotales(true)
        setLoadingLiqTotales(true)

        const [enviosResult, liqResult] = await Promise.all([
          obtenerEnviosTotales(
            fechaDesde ? fechaDesde.format('YYYY-MM-DD') : null,
            fechaHasta ? fechaHasta.format('YYYY-MM-DD') : null
          ),
          obtenerLiquidacionesTotales(
            fechaDesde ? fechaDesde.format('YYYY-MM-DD') : null,
            fechaHasta ? fechaHasta.format('YYYY-MM-DD') : null
          )
        ])

        setEnviosTotales(enviosResult.data[0])
        setLiqTotales(liqResult.data[0])

      } catch (error) {
        console.error(error)
      } finally {
        setLoadingEnviosTotales(false)
        setLoadingLiqTotales(false)
      }
    }
    obtenerDatos()
  }, [fechaDesde, fechaHasta])

  const cardsHeader = cardsEnvios.map(card => ({
    ...card,
    cantidad: Number(enviosTotales[card.id]) || 0,
    descripcion: card.id === "total" ?
      "" :
      enviosTotales.total > 0 ?
        `${Math.round(
          (enviosTotales[card.id] / enviosTotales.total) * 100
        )}% del total`
        : ""
  }))

  const cardsFooter = cardsLiquidaciones.map(card => ({
    ...card,
    cantidad: card.id !== "pct_paquetes_liquidados" ?
      "$" + Number(liqTotales[card.id] || "0").toLocaleString('es-AR')
      :
      Number(liqTotales[card.id] || 0) + "%"
    ,
    descripcion: card.id === "valor_total" || card.id === "pct_paquetes_liquidados" ?
      "" :
      enviosTotales.total > 0 ?
        `${Math.round(
          (liqTotales[card.id] / liqTotales.valor_total) * 100
        )}% del total`
        : ""
  }))

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2
      }}
    >
      {/* KPI Totales Envios */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg: "repeat(6, 1fr)"
          },
          gap: 2
        }}
      >
        {
          loadingEnviosTotales ?
            Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                height={112}
              />
            ))
            :
            cardsHeader
              .map((card, index) => (
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

      {/* GRAFICO + TABLA DE TRANSPORTISTAS */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 2fr"
          },
          gap: 2
        }}
      >
        <StatusCard />
        <TableResumenCard titulo="Envíos por transportista" footer="Ver todos los transportistas" url="/transportistas" >
          <TableTransportistasResumen />
        </TableResumenCard>
      </Box>

      {/* TABLA DE ENVÍOS RECIENTES */}
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr"
          }
        }}>
        <TableResumenCard titulo="Envíos recientes" footer="Ver todos los envíos" url="/envios">
          <TableEnviosResumen />
        </TableResumenCard>
      </Box>

      {/* KPI Totales Liquidaciones */}
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
          loadingLiqTotales ?
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                height={112}
              />
            ))
            :
            cardsFooter
              .map((card, index) => (
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
    </Box>
  );
}