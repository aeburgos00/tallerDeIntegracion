import {
  Box,
  Button,
  Skeleton,
  Typography,
} from "@mui/material"

import DescargaIcon from '@mui/icons-material/ArrowDownward';
import NuevoIcon from '@mui/icons-material/Add';

import { useEffect, useState } from 'react'

import TablaPaginacionContenedor from "../../components/TablaPaginacionContenedor.jsx";
import TablaLocalidades from "../../components/tablasContenedor/TablaLocalidades.jsx";

import SummaryCard from "../../components/SummaryCard"

import FiltrosGenerico from "../../components/FiltrosGenerico.jsx"
import FiltroLocalidades from "../../components/filtros/FiltroLocalidades.jsx"

import cardsLocalidades from "../../components/datos/dataKPILocalidades.jsx"

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
    cantidad: e.id !== "costo_promedio" ?
      Number(localidades[e.id]) || 0
      :
      "$" + (Number(localidades[e.id]) || 0).toLocaleString('es-AR')
  }))

  return (
    <Box
<<<<<<< HEAD
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2
      }}
=======
    sx={{
      display:"flex",
      flexDirection:"column",
      gap: 1.5
    }}
>>>>>>> origin/dev-agustin
    >
      {/* KPI Header */}
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
                titulo={e.titulo}
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
<<<<<<< HEAD
      <Box sx={{ background: "#ff2233" }}>
        <h2>
          Filtros
        </h2>
      </Box>
=======
      <FiltrosGenerico 
      onFilter={handleFilter} 
      onClear={handleClear}
      >
        <FiltroLocalidades 
        filtros={filtros} 
        setFiltros={setFiltros} 
        />
      </FiltrosGenerico>
>>>>>>> origin/dev-agustin

      {/* Mostrado... + CSV + ABM */}
      <Box sx={{
<<<<<<< HEAD
        display: "grid",
        gridTemplateColumns: "8fr 2fr 2fr",
        gap: 2
=======
        display:"flex",
        justifyContent:"space-between",
        gap:2,
        alignItems:"center",
>>>>>>> origin/dev-agustin
      }}
      >
        <Typography sx={{
          color:"#777"
        }}>
          Mostrando {loc[0].cantidad} localidades
        </Typography>
        {/* BOTONES */}
        <Box
<<<<<<< HEAD
          sx={{
            display: "flex",
            gap: 2
          }}
=======
        sx={{
          display:"flex",
          gap:2,
          
        }}
>>>>>>> origin/dev-agustin
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
<<<<<<< HEAD
      <Box>
        {/* Grilla */}
        <TableResumenCard></TableResumenCard>
        {/* Filtros y paginacion */}
        <Box sx={{
          display: "grid",
          gridTemplateColumns: "8fr 4fr",
          gap: 2
        }}
        >
          <h3>Filas x pag</h3>
          <Box
            sx={{
              display: "flex",
              gap: 4,
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
=======
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
>>>>>>> origin/dev-agustin
      </Box>

    </Box>
  )
}
