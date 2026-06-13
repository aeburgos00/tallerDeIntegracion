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
import TablaEnvios from "../../components/tablasContenedor/TablaEnvios.jsx";

import SummaryCard from "../../components/SummaryCard"

import FiltrosGenerico from "../../components/FiltrosGenerico.jsx"
import FiltroEnvios from "../../components/filtros/FiltroEnvios.jsx"

import cardsEnvios from "../../components/datos/dataKPIEnvios.jsx";

import { obtenerEnviosTotales, exportarEnviosCSV } from '../../services/api.js'

import useDateFilter from '../../hooks/useDateFilter.js'

import ABMEnvios from "../../components/abm/ABMEnvios.jsx";


export default function EnvioDePaquetes() {
  const [loadingKPI, setLoadingKPI] = useState(true)
  
  const [enviosTotales, setEnviosTotales] = useState({});

  const [filtros, setFiltros] = useState({
    fechaEnvio: null,
    cliente: "",
    direccion: "",
    localidad: "",
    transportista: "",
    estado:"",
    tarifa:"",
    liquidacion:""
  });

  const [openABM, setOpenABM] = useState(false);
  const [envioSeleccionado, setEnvioSeleccionado] = useState(null)

  const handleNuevo = () => {
    setEnvioSeleccionado(null);
    setOpenABM(true)
  }

  const handleEditar = (envio) => {
    setEnvioSeleccionado(envio)
    setOpenABM(true)
  }

  const handleFilter = () => {
    console.log(filtros);
  };

  const handleClear = () => {
    setFiltros({
      fechaEnvio: null,
      cliente: "",
      direccion: "",
      localidad: "",
      transportista: "",
      estado:"",
      tarifa:"",
      liquidacion:""
    });
  };

  const {
    fechaDesde,
    fechaHasta
  } = useDateFilter()

  const handleExportar = async () => {
    try {
      await exportarEnviosCSV(
        fechaDesde.format("YYYY-MM-DD"),
        fechaHasta.format("YYYY-MM-DD")
      )
    } catch(error) {
      console.error(error)
    }
}

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setLoadingKPI(true)

        const enviosTotResult = await obtenerEnviosTotales(
          fechaDesde? fechaDesde.format('YYYY-MM-DD'): null,
          fechaHasta? fechaHasta.format('YYYY-MM-DD'): null
        )
        
        setEnviosTotales(enviosTotResult.data[0])

      } catch (error) {
        console.error(error)
      } finally {
        setLoadingKPI(false)
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
      <FiltrosGenerico 
      onFilter={handleFilter} 
      onClear={handleClear}
      >
        <FiltroEnvios 
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
          Mostrando {cards[0].cantidad} envios
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
          onClick={handleExportar}
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
          onClick={handleNuevo}
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
            Nuevo Envío
          </Button>

           <ABMEnvios
              open={openABM}
              onClose={() => setOpenABM(false)}
              idEnvio={envioSeleccionado}
            />

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
          <TablaEnvios onEdit={handleEditar}/>
        </TablaPaginacionContenedor>
      </Box>

    </Box>
  )
}

