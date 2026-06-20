import React from 'react'


import {
  Box,
  Typography,
  Skeleton,
} from "@mui/material"

import { useEffect, useState } from "react"
import dayjs from "dayjs"
import "dayjs/locale/es"

import useAuth from "../../hooks/useAuth"
import cardsEnvios from "../../components/datos/dataKPIEnvios.jsx"

import { obtenerEnviosPorTransportistaId } from "../../services/api2.js"

dayjs.locale("es")

export default function Inicio() {
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [pendientesHoy, setPendientesHoy] = useState(0)

  const hoy = dayjs()

  const cardPendientes = cardsEnvios.find(c => c.id === "pendientes")
  const Icono = cardPendientes?.icono
  const color = cardPendientes?.color ?? "#713dfe"

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setLoading(true)
        const result = await obtenerEnviosPorTransportistaId(user.id, {
          estado: 1,
          fechaEnvio: hoy,
        })
        setPendientesHoy(result.data?.length ?? 0)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) obtenerDatos()
  }, [user])

  return (
    <Box sx={{
      background: "#fff",
      borderRadius: 3,
      border: "1px solid #e5e7eb",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      p: 3,
      display: "flex",
      flexDirection: "column",
      minHeight: "100%",
      gap: 3,
    }}>

      {/* Encabezado */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
          Bienvenido {user?.nombre}
        </Typography>
        <Typography sx={{ fontSize: 13 }}>
          {hoy.format("DD/MM/YYYY")}
        </Typography>
      </Box>

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


  )
}