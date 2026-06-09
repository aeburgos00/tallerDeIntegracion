import {
  Box,
  Button,
  Skeleton,
  Typography,
} from "@mui/material"

import DescargaIcon from '@mui/icons-material/ArrowDownward';
import NuevoIcon from '@mui/icons-material/Add';

import TablaPaginacionContenedor from "../../components/TablaPaginacionContenedor.jsx";
import TablaLocalidades from "../../components/TablaLocalidades.jsx";

import SummaryCard from "../../components/SummaryCard"

import FiltrosGenerico from "../../components/FiltrosGenerico.jsx"
import FiltroLocalidades from "../../components/FiltroLocalidades.jsx"

import { useEffect, useState } from 'react'

import cardsLocalidades from "../../components/dataKPILocalidades.jsx"

import { obtenerLocalidadesTotales } from "../../services/api.js"


export default function Localidades() {

  const [loadingKPI, setLoadingKPI] = useState(true)
  
  const [localidades, setLocalidades] = useState([])

  const [filtros, setFiltros] = useState({
    localidad: "",
    codigoPostal: "",
    estado: "",
    provincia: ""
  });

  const handleFilter = () => {
    console.log(filtros);
  };

  const handleClear = () => {
    setFiltros({
      localidad: "",
      codigoPostal: "",
      estado: "",
      provincia: ""
    });
  };

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setLoadingKPI(true)
  
        const result = await obtenerLocalidadesTotales()
        setLocalidades(result.data[0])
  
      } catch (error) {
        console.error(error)
      } finally {
        setLoadingKPI(false)
      }
    }
    obtenerDatos()
  }, [])

  const loc = cardsLocalidades.map(e => ({
      ...e,
      cantidad: e.id !== "costo_promedio"?
      Number(localidades[e.id]) || 0
      :
      "$" + (Number(localidades[e.id]) || 0).toLocaleString('es-AR')
  }))

  return (
    <Box
    sx={{
      display:"flex",
      flexDirection:"column",
      gap: 1.5
    }}
    >
      {/* KPI Header */}
      <Box 
      sx={{
        display:"grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          lg: "repeat(4, 1fr)"
        },
        gap:2
      }}
      >
        {
          loadingKPI?
           Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                height={112}
              />
            ))
          :
          loc.map((e, index) => (
            <SummaryCard 
            key={index}
            titulo= {e.titulo}
            cantidad={e.cantidad}
            descripcion={e.descripcion || ""}
            icono={e.icono}
            color={e.color}
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
        <FiltroLocalidades 
        filtros={filtros} 
        setFiltros={setFiltros} 
        />
      </FiltrosGenerico>

      {/* Mostrado... + CSV + ABM */}
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
          Mostrando {loc[0].cantidad} localidades
        </Typography>
        {/* BOTONES */}
        <Box
        sx={{
          display:"flex",
          gap:2,
          
        }}
        >
          <Button
          variant="outlined"
          //onClick={}
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
            fontSize:13
          }}>
            Exportar CSV
          </Button>

          <Button 
          variant="contained"
          //onClick={}
          startIcon={<NuevoIcon />}
          size="small"
          sx={{
            background:"#3b82f6",
            borderRadius:2,
            textTransform: "none",
            whiteSpace:"nowrap",
            px:1.5,
            height:36,
            fontSize:13
          }}>
            Nuevo Localidad
          </Button>
        </Box>
      </Box>

      {/* Grilla */}
      <Box 
      sx={{
        backgroundColor:"#fff",
        borderRadius:2,
        border:"1px solid #e5e7eb",
        boxShadow:
        "0 1px 2px rgba(0,0,0,0.04)"
      }}>
        <TablaPaginacionContenedor>
          <TablaLocalidades></TablaLocalidades>
        </TablaPaginacionContenedor>        
      </Box>

    </Box>
  )
}
