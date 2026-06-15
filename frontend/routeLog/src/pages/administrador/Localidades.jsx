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

import ABMLocalidades from "../../components/abm/ABMLocalidades.jsx";

import { obtenerLocalidades, exportarLocalidadesCSV } from "../../services/api.js"

export default function Localidades() {

  const [loadingKPI, setLoadingKPI] = useState(true)

  const [localidades, setLocalidades] = useState([])

  const [filtros, setFiltros] = useState({
    localidad: "",
    codigoPostal: "",
    estado: "",
    provincia: ""
  });

  const [openABM, setOpenABM] = useState(false);

  const [localidadSeleccionada, setLocalidadSeleccionada] = useState(null)

  const handleNuevo = () => {
    setLocalidadSeleccionada(null)
    setOpenABM(true)
  }

  const handleEditar = (localidad) => {
    setLocalidadSeleccionada(localidad.id_loc)
    setOpenABM(true)
  }

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

  const handleExportar = async () => {
    try {
      await exportarLocalidadesCSV()
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {

    const obtenerDatos = async () => {

      try {

        setLoadingKPI(true)

        const result = await obtenerLocalidades()

        setLocalidades(result.data)

      } catch (error) {

        console.error(error)

      } finally {

        setLoadingKPI(false)

      }

    }

    obtenerDatos()

  }, [])

  const loc = cardsLocalidades.map(e => {

    if (e.id === "total") {

      return {
        ...e,
        cantidad: localidades.length
      }

    }

    if (e.id === "activas") {

      return {
        ...e,
        cantidad:
          localidades.filter(
            l => l.estado === "Activo"
          ).length
      }

    }

    if (e.id === "inactivas") {

      return {
        ...e,
        cantidad:
          localidades.filter(
            l => l.estado === "Inactivo"
          ).length
      }

    }

    if (e.id === "costo_promedio") {

      const promedio =
        localidades.length > 0
          ?
          localidades.reduce(
            (acc, l) => acc + Number(l.costo_envio),
            0
          ) / localidades.length
          :
          0

      return {
        ...e,
        cantidad:
          "$" +
          promedio.toLocaleString(
            "es-AR",
            {
              maximumFractionDigits: 0
            }
          )
      }

    }

    return {
      ...e,
      cantidad: 0
    }

  })

  return (

    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2
      }}
    >

      {/* KPI */}

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

      <FiltrosGenerico
        onFilter={handleFilter}
        onClear={handleClear}
      >

        <FiltroLocalidades
          filtros={filtros}
          setFiltros={setFiltros}
        />

      </FiltrosGenerico>

      {/* Mostrado + Botones */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          alignItems: "center",
        }}
      >

        <Typography
          sx={{
            color: "#777"
          }}
        >

          Mostrando {localidades.length} localidades

        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >

          <Button
            variant="outlined"
            startIcon={<DescargaIcon />}
            onClick={handleExportar}
            size="small"
            sx={{
              borderColor: "#65a30d",
              color: "#65a30d",
              background: "#fff",
              borderRadius: 2,
              textTransform: "none",
              whiteSpace: "nowrap",
              px: 1.5,
              height: 36,
              fontSize: 13
            }}
          >

            Exportar CSV

          </Button>

          <Button
            variant="contained"
            onClick={handleNuevo}
            startIcon={<NuevoIcon />}
            size="small"
            sx={{
              background: "#3b82f6",
              borderRadius: 2,
              textTransform: "none",
              whiteSpace: "nowrap",
              px: 1.5,
              height: 36,
              fontSize: 13
            }}
          >

            Nueva Localidad

          </Button>

          <ABMLocalidades
            open={openABM}
            onClose={() => setOpenABM(false)}
            idLocalidad={localidadSeleccionada}
          />

        </Box>

      </Box>

      {/* Tabla */}

      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 2,
          border: "1px solid #e5e7eb",
          boxShadow:
            "0 1px 2px rgba(0,0,0,0.04)"
        }}
      >

        <TablaPaginacionContenedor>

          <TablaLocalidades
            localidades={localidades}
            onEdit={handleEditar}
          />

        </TablaPaginacionContenedor>

      </Box>

    </Box>

  )

}