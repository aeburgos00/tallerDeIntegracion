import {
  Box,
  Button,
  Skeleton,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

import DescargaIcon from "@mui/icons-material/ArrowDownward";
import NuevoIcon from "@mui/icons-material/Add";
import AbcIcon from "@mui/icons-material/Abc";

import { useEffect, useState } from "react";

import SummaryCard from "../../components/SummaryCard";

import FiltrosGenerico from "../../components/FiltrosGenerico";
import FiltroTransportistas from "../../components/filtros/FiltroTransportistas";

import cardsTransportistas from "../../components/datos/dataKPITransportistas";

import TablaPaginacionContenedor from "../../components/TablaPaginacionContenedor";
import TablaTransportistas from "../../components/tablasContenedor/TablaTransportistas";
import ABMTransportistas from "../../components/abm/ABMTransportistas";

import {
  obtenerTransportistasTotales,
  exportarTransportistasCSV,
} from "../../services/api";

export default function Transportistas() {

  /* ===========================
      ESTADOS
  ============================ */

  const [loadingKPI, setLoadingKPI] = useState(true);

  const [transportistasTotales, setTransportistasTotales] = useState({});

  const [filtros, setFiltros] = useState({
    fechaAlta: null,
    nombre: "",
    usuario: "",
    dni: "",
    estado: "",
  });

  const [openABM, setOpenABM] = useState(false);

  const [idTransportista, setIdTransportista] = useState(null);

  const [refreshTabla, setRefreshTabla] = useState(0);

  const [mensaje, setMensaje] = useState("");

  const [tipoMensaje, setTipoMensaje] = useState("success");

  /* ===========================
      ABM
  ============================ */

  const handleNuevo = () => {
    setIdTransportista(null);
    setOpenABM(true);
  };

  const handleEditar = (id) => {
    setIdTransportista(id);
    setOpenABM(true);
  };

  const handleClose = () => {
    setIdTransportista(null);
    setOpenABM(false);
  };

  const handleGuardar = () => {
    setRefreshTabla((prev) => prev + 1);

    setMensaje("Transportista guardado correctamente");
    setTipoMensaje("success");

    handleClose();
  };

  /* ===========================
      EXPORTAR
  ============================ */

  const handleExportar = async () => {
    try {
      await exportarTransportistasCSV(filtros);
    } catch (error) {
      console.error(error);
    }
  };

  /* ===========================
      KPI
  ============================ */

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setLoadingKPI(true);

        const result = await obtenerTransportistasTotales();

        setTransportistasTotales(result.data[0]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingKPI(false);
      }
    };

    obtenerDatos();
  }, []);

  const cards = cardsTransportistas.map(card => ({
    ...card,
    cantidad:
      card.id === "tarifa_promedio"
        ? `$ ${Number(transportistasTotales[card.id] || 0).toLocaleString("es-AR")}`
        : Number(transportistasTotales[card.id]) || 0,
    descripcion: ""
  }));
  /* ===========================
      RETURN
  ============================ */

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* KPI */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg: "repeat(4,1fr)",
          },
          gap: 2,
        }}
      >
        {loadingKPI
          ? Array.from({ length: 4 }).map((_, index) => (
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

      {/* FILTROS */}

      <FiltrosGenerico
        filtros={filtros}
        setFiltros={setFiltros}
      >
        <FiltroTransportistas
          filtros={filtros}
          setFiltros={setFiltros}
        />
      </FiltrosGenerico>

      {/* ACCIONES */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography>
          Mostrando {transportistasTotales.total || 0} transportistas
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <Button
            startIcon={<DescargaIcon />}
            onClick={handleExportar}
          >
            Exportar CSV
          </Button>

          <Button
            variant="contained"
            startIcon={<NuevoIcon />}
            onClick={handleNuevo}
            sx={{
              background: "#3b82f6",
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Nuevo Transportista
          </Button>
        </Box>
      </Box>

      {/* TABLA */}

      <TablaPaginacionContenedor filasPorPagina={10}>
        <TablaTransportistas
          filtros={filtros}
          refresh={refreshTabla}
          onEdit={handleEditar}
          filasPorPagina={10}
        />
      </TablaPaginacionContenedor>

      {/* ABM */}

      <ABMTransportistas
        open={openABM}
        transportistaId={idTransportista}
        onClose={handleClose}
        onSave={handleGuardar}
      />

      {/* MENSAJES */}

      <Snackbar
        open={!!mensaje}
        autoHideDuration={4000}
        onClose={() => setMensaje("")}
      >
        <Alert
          severity={tipoMensaje}
          onClose={() => setMensaje("")}
        >
          {mensaje}
        </Alert>
      </Snackbar>
    </Box>
  );
}