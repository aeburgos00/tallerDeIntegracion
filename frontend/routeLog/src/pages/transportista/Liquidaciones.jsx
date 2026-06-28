import {
  Box,
  Typography,
  Skeleton,
} from "@mui/material"

import { useEffect, useState } from "react"

import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"

import PaidIcon from "@mui/icons-material/Paid"

import dayjs from "dayjs"
import "dayjs/locale/es"
import weekday from "dayjs/plugin/weekday"
dayjs.extend(weekday)
dayjs.locale("es")

import useAuth from "../../hooks/useAuth"
import { obtenerLiquidacionesPorTransportistaId } from "../../services/apiTransportistas"

import MontoDestacadoMobile from "../../components/MontoDestacadoMobile.jsx"

export default function LiquidacionesMob() {
  const { user } = useAuth()

  const [fechaDesde, setFechaDesde] = useState(dayjs().weekday(0))
  const [fechaHasta, setFechaHasta] = useState(dayjs())

  const [loading, setLoading] = useState(true)
  const [valorTotal, setValorTotal] = useState(0)

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setLoading(true)
        const result = await obtenerLiquidacionesPorTransportistaId(
          user.id,
          fechaDesde.format("YYYY-MM-DD"),
          fechaHasta.format("YYYY-MM-DD")
        )
        setValorTotal(result.data?.[0]?.valor_total ?? 0)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) obtenerDatos()
  }, [user, fechaDesde, fechaHasta])

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

      {/* Título con ícono */}
      <Box sx={{
        background: "#fff",
        borderRadius: 3,
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
      }}>
        <Box sx={{
          width: 36,
          height: 36,
          borderRadius: 2,
          background: "#3b82f620",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <PaidIcon sx={{ fontSize: 20, color: "#3b82f6" }} />
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: 20, color: "#111827" }}>
          Liquidaciones
        </Typography>
      </Box>

      {/* Fechas, dentro de una card */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, px: 2 }}></Box>
      <Box sx={{
        background: "#fff",
        borderRadius: 3,
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        p: 2,
        px: 2
      }}>
        <Typography sx={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, mb: 1.5 }}>
          Período a Consultar
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <DatePicker
              label="Desde"
              value={fechaDesde}
              onChange={(newValue) => newValue && setFechaDesde(newValue)}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  sx: {
                    "& .MuiOutlinedInput-root": { borderRadius: 2 }
                  }
                }
              }}
            />
            <DatePicker
              label="Hasta"
              value={fechaHasta}
              onChange={(newValue) => newValue && setFechaHasta(newValue)}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  sx: {
                    "& .MuiOutlinedInput-root": { borderRadius: 2 }
                  }
                }
              }}
            />
          </Box>
        </LocalizationProvider>
      </Box>

      {/* Monto */}
      <MontoDestacadoMobile etiqueta="Total a cobrar" valor={valorTotal} loading={loading} />
    </Box>
  )
}