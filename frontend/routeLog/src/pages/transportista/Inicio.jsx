import {
  Box,
  Typography,
  Skeleton,
} from "@mui/material"

import { useEffect, useState } from "react"
import dayjs from "dayjs"
import "dayjs/locale/es"
import weekday from "dayjs/plugin/weekday"
dayjs.extend(weekday)
dayjs.locale("es")

import useAuth from "../../hooks/useAuth"
import cardsEnvios from "../../components/datos/dataKPIEnvios.jsx"
import KPICardMobile from "../../components/KPICardMobile.jsx"
import MontoDestacadoMobile from "../../components/MontoDestacadoMobile.jsx"

import {
  obtenerEnviosPorTransportistaId,
  obtenerLiquidacionesPorTransportistaId
} from "../../services/apiTransportistas.js"

export default function Inicio() {
  const { user } = useAuth()

  const hoy = dayjs()
  const lunesDeEstaSemana = dayjs().weekday(0)   // mismo criterio que Liquidaciones.jsx

  const cardPendientes = cardsEnvios.find(c => c.id === "pendientes")
  const Icono = cardPendientes?.icono
  const color = cardPendientes?.color ?? "#713dfe"

  const [loading, setLoading] = useState(true)
  const [pendientesHoy, setPendientesHoy] = useState(0)
  const [pendientesTotal, setPendientesTotal] = useState(0)
  const [valorSemana, setValorSemana] = useState(0)

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setLoading(true)

        const [hoyResult, totalResult, liqResult] = await Promise.all([
          obtenerEnviosPorTransportistaId(user.id, { estado: 1, fechaEnvio: hoy }),
          obtenerEnviosPorTransportistaId(user.id),
          obtenerLiquidacionesPorTransportistaId(
            user.id,
            lunesDeEstaSemana.format("YYYY-MM-DD"),
            hoy.format("YYYY-MM-DD")
          )
        ])

        setPendientesHoy(hoyResult.data?.length ?? 0)

        const todosLosEnvios = totalResult.data ?? []
        setPendientesTotal(todosLosEnvios.filter(e => e.id_estado === 1).length)

        setValorSemana(liqResult.data?.[0]?.valor_total ?? 0)

      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) obtenerDatos()
  }, [user])

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

      {/* Bienvenida + pendientes de hoy */}
      <Box sx={{
        background: "#fff",
        borderRadius: 3,
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
            Bienvenido {user?.nombre}
          </Typography>
          <Typography sx={{ fontSize: 13 }}>
            {hoy.format("DD/MM/YYYY")}
          </Typography>
        </Box>

        <Typography sx={{ fontSize: 13, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
          Resumen del día
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            {loading ? (
              <Skeleton variant="text" width="90%" height={60} />
            ) : (
              <Typography sx={{ fontSize: 15, color: "#374151", lineHeight: 1.5 }}>
                Tiene{" "}
                <Typography component="span" sx={{ fontWeight: 700, color }}>
                  {pendientesHoy}
                </Typography>{" "}
                {pendientesHoy === 1 ? "paquete pendiente" : "paquetes pendientes"} de envío
                para el día de hoy
              </Typography>
            )}
          </Box>

          <Box sx={{
            width: 72,
            height: 72,
            borderRadius: 2,
            border: `2px solid ${color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            {Icono && <Icono sx={{ fontSize: 36, color }} />}
          </Box>
        </Box>
      </Box>

      {/* Total a liquidar en la semana */}
      <MontoDestacadoMobile
        etiqueta="Total a liquidar esta semana"
        valor={valorSemana}
        loading={loading}
      />

    </Box>
  )
}