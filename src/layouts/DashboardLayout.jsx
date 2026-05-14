import * as React from 'react'

import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import SummaryCard from "../components/SummaryCard";
//import {cardsHeader, cardsFooter} = data from "../components/dataCardsResumen";
import data from "../components/dataCardsResumen";
const { cardsHeader, cardsFooter } = data;

//import { cardsHeader } from '../components/dataCardsResumen';

import StatusCard from "../components/StatusCard";
//import TableTransportistasResumen from '../components/TableTransportistasResumen';
import EnviosPorFleteroCard from '../components/EnviosPorFleteroCard';

export default function DashboardLayout() {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <Box sx={{ display: "flex" }}>
   
      <Sidebar 
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex} />

      <Box sx={{ flexGrow: 1, backgroundColor: "#F0EEE8", minHeight: "100vh" }}>
        <Navbar 
          selectedIndex={selectedIndex} />

         <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            p: 2
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
              sx={{
                width: {
                  xs: "100%",
                  sm: "48%",
                  md: "24%"
                }
              }}
              height={112}
            />
          ))}
          </Box>
          
          <Box 
          sx={{
            p:2,
            display: "flex",
            gap: 2,          }}
          >
            <StatusCard/>
            <EnviosPorFleteroCard />
          </Box>

          <Box sx={{p:2}}>
            <EnviosPorFleteroCard width={360*4+3*16}/>
          </Box>
          
          <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            p: 2
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
              sx={{
                width: {
                  xs: "100%",
                  sm: "48%",
                  md: "24%"
                }
              }}
              height={112}
            />
          ))}
          </Box>

      </Box>

    </Box>
  );
}