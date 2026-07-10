import {
  Box,
  Button,
  Skeleton,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material"

import DescargaIcon from '@mui/icons-material/ArrowDownward';
import NuevoIcon from '@mui/icons-material/Add';

import { useEffect, useState } from 'react'

import TablaPaginacionContenedor from "../../components/TablaPaginacionContenedor.jsx";
import TablaTransportistas from "../../components/tablasContenedor/TablaTransportistas.jsx";

import SummaryCard from "../../components/SummaryCard.jsx"

import FiltrosGenerico from "../../components/FiltrosGenerico.jsx"
import FiltroTransportistas from "../../components/filtros/FiltroTransportistas.jsx"

import cardsTransportistas from "../../components/datos/dataKPITransportistas.jsx";

import ABMTransportistas from "../../components/abm/ABMTransportistas.jsx";

import {
  obtenerTransportistasTotales,
  exportarTransportistasCSV
} from '../../services/api.js';

export default function Transportistas() {

    const [loadingKPI, setLoadingKPI] = useState(true)

    const [transportistasTotales, setTransportistasTotales] = useState({});

    const [filtros, setFiltros] = useState({
      nombre: "",
      dni: "",
      usuario: "",
      costo_envio: "",
      estado: ""
    });

    const filtrosVacios = {
      nombre: "",
      dni: "",
      usuario: "",
      costo_envio: "",
      estado: ""
    };

    const [filtrosAplicados, setFiltrosAplicados] = useState(filtros);

    const [openABM, setOpenABM] = useState(false);
    const [transportistaSeleccionado, setTransportistaSeleccionado] = useState(null)
    
    const [mensaje, setMensaje] = useState("")
    const [tipoMensaje, setTipoMensaje] = useState("success")

    const [refreshTabla, setRefreshTabla] = useState(0)

    const [pagina, setPagina] = useState(1);
    const [filasPorPagina, setFilasPorPagina] = useState(10);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [transportistasMostrados, setTransportistasMostrados] = useState(0)

    const handleNuevo = () => {
      setTransportistaSeleccionado(null);
      setOpenABM(true)
    }

    const handleEditar = (transportista) => {
      setTransportistaSeleccionado(transportista)
      setOpenABM(true)
    }

    const handleClose = () => {
      setOpenABM(false)
      setTransportistaSeleccionado(null)
    }

    const handleFilter = () => {
      setPagina(1);
      setFiltrosAplicados({ ...filtros });
    };

    const handleClear = () => {
      setFiltros({...filtrosVacios});
      setFiltrosAplicados({...filtrosVacios});
      setPagina(1);
    };

    const handleExportar = async () => {
      try {
       await exportarTransportistasCSV(filtros)
      } catch(error) {
        console.error(error)
      }
    }

    useEffect(() => {
        const obtenerTotales = async () => {
          try {
          setLoadingKPI(true)
    
            const transportistasResult = await obtenerTransportistasTotales()
            setTransportistasTotales(transportistasResult.data[0])
    
          } catch (error) {
            console.error(error)
          } finally {
          setLoadingKPI(false)
          }
        }
        obtenerTotales()
    },[refreshTabla])

    const cards = cardsTransportistas.map(card => ({
        ...card,
        cantidad: card.id === "costo_promedio"?
            Number(transportistasTotales[card.id] || 0).toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
          : 
          Number(transportistasTotales[card.id]) || 0
      }))

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

      {/* KPI Transportistas */}
      <Box 
      sx={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(4, 1fr)", 
        gap: 2 
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
        cards.map((card, index) => (
          <SummaryCard
            key={index}
            titulo={card.titulo}
            cantidad={card.cantidad}
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
        <FiltroTransportistas 
        filtros={filtros} 
        setFiltros={setFiltros} 
        />
      </FiltrosGenerico>

      {/* Mostrado... + Botones */}
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
          Mostrando {transportistasMostrados} transportistas
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
            Nuevo Transportista
          </Button>
 
           <ABMTransportistas
              open={openABM}
              onClose={handleClose}
              idTransportista={transportistaSeleccionado}
              onSuccess={(mensaje)=>{
                setMensaje(mensaje)
                setTipoMensaje("success")
                setRefreshTabla(prev => prev + 1)
                setOpenABM(false)
              }}
            />
            <Snackbar
              open={!!mensaje}
              autoHideDuration={4000}
              onClose={() => setMensaje("")}
            >
              <Alert severity={tipoMensaje}>
                {mensaje}
              </Alert>
            </Snackbar> 

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
        <TablaPaginacionContenedor
          pagina={pagina}
          filasPorPagina={filasPorPagina}
          totalPaginas={totalPaginas}
          onPaginaChange={setPagina}
          onFilasPorPaginaChange={(valor) => {
            setPagina(1);
            setFilasPorPagina(valor);
          }}
        >
          <TablaTransportistas 
          cantTransportistas={setTransportistasMostrados}
          filtros={filtrosAplicados}
          pagina={pagina}
          filasPorPagina={filasPorPagina}
          onTotalPaginasChange={setTotalPaginas}
          onEdit={handleEditar}
          refresh={refreshTabla}
          onDeleteSuccess={() => {
            setRefreshTabla(prev => prev + 1);
          }}
          />
        </TablaPaginacionContenedor>
      </Box>

    </Box>
  )
}