import {
  Box,
  Skeleton
} from "@mui/material"

import TableResumenCard from "../../components/TableResumenCard.jsx"
import TableLiquidacionesResumen from "../../components/TableLiquidacionesResumen.jsx"
import SummaryCard from "../../components/SummaryCard"

import { obtenerLiquidacionesPorTransportista } from '../../services/api.js'
import { obtenerTransportistas } from "../../services/api.js"

import AbcIcon from '@mui/icons-material/Abc';
import ValorTotalIcon from '@mui/icons-material/MonetizationOnOutlined'
import EnviosIcon from '@mui/icons-material/LocalShippingOutlined'
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material"


import { useEffect, useState } from "react"

import useDateFilter from "../../hooks/useDateFilter"
import { obtenerEnviosPorTransportista } from "../../services/api.js"

export default function Liquidaciones() {

  const [liqTotales, setLiqTotales] = useState({})
  const [loading, setLoading] = useState(true)
  
  const [transportistaSeleccionado, setTransportistaSeleccionado] = useState("")
  const [transportistas, setTransportistas] = useState([])

  const { fechaDesde, fechaHasta } = useDateFilter()
  

  
  
  const kpis = [
    {
      titulo: "Total a Liquidar",
      valor: "$" + Number(liqTotales.valor_total || 0).toLocaleString("es-AR"),
      icono: ValorTotalIcon,
      color: "#65a30d"
    },
    {
      titulo: "Cantidad de Envíos",
      valor: liqTotales.cantidad_envios || 0,
      icono: EnviosIcon,
      color: "#3b82f6"
    }
  ]


  useEffect(() => {
    const traerDatos = async () => {
      try {
        setLoading(true)

        
        const result = await obtenerLiquidacionesTotales(
          fechaDesde ? fechaDesde.format("YYYY-MM-DD") : null,
          fechaHasta ? fechaHasta.format("YYYY-MM-DD") : null
        )

        setLiqTotales(result.data[0])

      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    traerDatos()
  }, [fechaDesde, fechaHasta])


  
  useEffect(() => {
    const cargarTransportistas = async () => {
      try {
        const result = await obtenerTransportistas()
        
        if (result.ok) 
        {
          setTransportistas(result.data || [])
        } else 
        {
          setTransportistas([])
        }

      } catch (error) {
        console.error(error)
      }
    }

    cargarTransportistas()
  }, [])



  return (
    //Contenedor total
    <Box
    sx={{
      display:"flex",
      flexDirection:"column",
      gap: 2
    }}
    >
      {/* KPI x4 */}
      <Box 
      sx={{
        display:"grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap:2
      }}
      >
        {
        kpis.map((e, index) => (
          <SummaryCard 
            key={index}
            titulo={e.titulo}
            cantidad={loading ? "..." : e.valor}
            icono={e.icono}
            color={e.color}
          />
        ))
        }
  
      </Box>

      {/* Filtros */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          padding: 2,
          background: "#f5f5f5",
          borderRadius: 2
        }}
      >
        
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.5
          }}
        >
          {/*
          <span style={{ fontSize: 13, fontWeight: 500 }}>
            Transportista
          </span>
          */}
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel>Transportista</InputLabel>
              <Select
                value={transportistaSeleccionado}
                label="Transportista"
                onChange={(e) => setTransportistaSeleccionado(e.target.value)}
              >
                <MenuItem value="">
                  Todos
                </MenuItem>

                
                {transportistas.map((t, index) => {
                  const nombre = `Transportista ${t.id_usuario || t.id}`

                  return (
                    <MenuItem
                      key={t.id || index}
                      value={nombre}
                    >
                      {nombre}
                    </MenuItem>
                  )
                })}

              </Select>
            </FormControl>
        </Box>
      </Box>


      {/* Grilla */}
      <Box>
                
        <TableResumenCard titulo="Liquidaciones por transportista">   
          <TableLiquidacionesResumen 
            transportista={transportistaSeleccionado}
          />
        </TableResumenCard>

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
