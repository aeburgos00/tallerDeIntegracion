import * as React from 'react'

import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import SummaryCard from "../components/SummaryCard";
import data from "../components/dataCardsResumen";
const { cardsHeader, cardsFooter } = data;


import StatusCard from "../components/StatusCard";
import TableResumenCard from '../components/TableResumenCard';

import TableTransportistasResumen from "../components/TableTransportistasResumen";

import TableEnviosResumen from "../components/TableEnviosResumen";

export default function DashboardLayout() {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <Box 
    sx={{ 
      display: "flex", 
  //    flexDirection: "column",
 //     gap: 2,
 //     p: 2,
    }}>
   
      <Sidebar 
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex} />

      <Box 
      sx={{ 
        flexGrow: 1, 
        minWidth: 0,
        backgroundColor: "#F0EEE8", 
        minHeight: "100vh" 
      }}>
        <Navbar 
          selectedIndex={selectedIndex} />

        <Box
          sx={{
            p: 1.5,
            display: "flex",
            flexDirection: "column",
            gap: 2
          }}
        >
         {/* KPI Totales Envios */}
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
          {cardsHeader
          .filter(d => d.titulo !== "Visitas Fallidas")
          .map((card, index) => (
            <SummaryCard
              key={index}
              titulo={card.titulo}
              cantidad={card.cantidad}
              descripcion={card.descripcion}
              icono={card.icono}
              color={card.color}
              height={112}
            />
          ))}
          </Box>
          
          {/* GRAFICO + TABLA DE TRANSPORTISTAS */}
          <Box 
          sx={{   
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "1fr 2fr"
            },
            gap: 2     
          }}
          >
            <StatusCard/>
            <TableResumenCard titulo="Envíos por transportista" footer="Ver todos los transportistas" >
               <TableTransportistasResumen/>
            </TableResumenCard>
          </Box>

          {/* TABLA DE ENVÍOS RECIENTES */}
          <Box 
          sx={{
            width: "100%",
          }}>
            <TableResumenCard titulo="Envíos recientes" footer="Ver todos los envíos">
              <TableEnviosResumen/>
            </TableResumenCard>
          </Box>
          
          {/* KPI Totales Liquidaciones */}
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
          {cardsFooter
          .map((card, index) => (
            <SummaryCard
              key={index}
              titulo={card.titulo}
              cantidad={card.cantidad}
              descripcion={card.descripcion}
              icono={card.icono}
              color={card.color}
              height={112}
            />
          ))}
          </Box>
        </Box>
      </Box>

    </Box>
  );
}