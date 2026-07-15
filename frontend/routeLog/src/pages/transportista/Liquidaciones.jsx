import {
  Box,
  Typography,
  Skeleton,
  Divider,
} from "@mui/material"

import { useEffect, useState } from "react"

import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"

import PaidIcon from "@mui/icons-material/Paid"
import HistoryIcon from "@mui/icons-material/History"
import InfoIcon from "@mui/icons-material/Info"

import dayjs from "dayjs"
import "dayjs/locale/es"
import weekday from "dayjs/plugin/weekday"
dayjs.extend(weekday)
dayjs.locale("es")

import useAuth from "../../hooks/useAuth"
import {
  obtenerLiquidacionesPorTransportistaId,
  obtenerHistorialLiquidaciones,
  obtenerLiquidacionTentativa
} from "../../services/apiTransportistas"

import MontoDestacadoMobile from "../../components/MontoDestacadoMobile.jsx"

export default function LiquidacionesMob() {
  const { user } = useAuth()

  const [fechaDesde, setFechaDesde] = useState(dayjs().weekday(0))
  const [fechaHasta, setFechaHasta] = useState(dayjs())

  const [loading, setLoading] = useState(true)
  const [loadingHistorial, setLoadingHistorial] = useState(true)
  const [valorTotal, setValorTotal] = useState(0)
  const [historial, setHistorial] = useState([])

  // Carga el total del período seleccionado (Tentativo)
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setLoading(true)
        const result = await obtenerLiquidacionTentativa(
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

  // Carga el historial completo — solo una vez al montar
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setLoadingHistorial(true)
        const result = await obtenerHistorialLiquidaciones(user.id)
        setHistorial(result.data ?? [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoadingHistorial(false)
      }
    }

    if (user?.id) obtenerDatos()
  }, [user])

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pb: 4 }}>

      {/* Título */}
      <Box sx={{
        background: "#fff",
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
          borderRadius: 3,
          border: "1px solid #e5e7eb",
          p: 3,
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

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, px: 2 }}>

        {/* Fechas */}
        <Box sx={{
          background: "#fff",
          borderRadius: 3,
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          p: 2,

        }}>
          <Typography sx={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, mb: 1.5 }}>
            Período a consultar (monto tentativo)
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
                    sx: { "& .MuiOutlinedInput-root": { borderRadius: 2 } }
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
                    sx: { "& .MuiOutlinedInput-root": { borderRadius: 2 } }
                  }
                }}
              />
            </Box>
          </LocalizationProvider>
        </Box>

        {/* Monto del período */}
        <MontoDestacadoMobile
          etiqueta="Total tentativo a liquidar"
          valor={valorTotal}
          loading={loading}
        />

        {/* Historial */}
        <Box sx={{
          background: "#fff",
          borderRadius: 3,
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          p: 2,
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <HistoryIcon sx={{ fontSize: 16, color: "#9ca3af" }} />
            <Typography sx={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>
              Historial de liquidaciones            </Typography>
          </Box>

          {loadingHistorial ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="text" height={40} />
            ))
          ) : historial.length === 0 ? (
            <Typography sx={{ fontSize: 14, color: "#9ca3af", textAlign: "center", py: 2 }}>
              Sin liquidaciones anteriores
            </Typography>
          ) : (
            historial.map((liq, i) => (
              <Box key={liq.id}>
                <Box sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1.5,
                }}>
                  <Box>
                    <Typography sx={{ fontSize: 13, color: "#111827", fontWeight: 500 }}>
                      {liq.fecha_desde} — {liq.fecha_hasta}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "#9ca3af" }}>
                      {liq.cantidad_paquetes} {Number(liq.cantidad_paquetes) === 1 ? "paquete" : "paquetes"} · Liquidado el {liq.fecha_alta}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#3b82f6" }}>
                    $ {Number(liq.monto_total).toLocaleString("es-AR")}
                  </Typography>
                </Box>
                {i < historial.length - 1 && <Divider />}
              </Box>
            ))
          )}
        </Box>

      </Box>
      {/* Aviso informativo */}
      <Box sx={{
        background: "#eff6ff",
        borderRadius: 3,
        border: "1px solid #bfdbfe",
        p: 2,
        display: "flex",
        gap: 1.5,
        alignItems: "flex-start",
      }}>
        <InfoIcon sx={{ fontSize: 18, color: "#3b82f6", flexShrink: 0, mt: 0.2 }} />
        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#1e40af", mb: 0.5 }}>
            Información importante
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#1e40af", lineHeight: 1.5 }}>
            Las liquidaciones se generan semanalmente.{" "}
            Los montos pueden actualizarse hasta el cierre del período.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}