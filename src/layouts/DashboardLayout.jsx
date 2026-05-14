import * as React from 'react'

import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import SummaryCard from "../components/SummaryCard";
import cards from "../components/dataCardsResumen";

import StatusCard from "../components/StatusCard";

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

          {cards
          .filter(d => d.titulo !== "Visitas Fallidas")
          .map((card, index) => (
            <SummaryCard
              key={index}
              titulo={card.titulo}
              cantidad={card.cantidad}
              descripcion={card.descripcion}
              icono={card.icono}
              color={card.color}
            />
          ))}
          </Box>
          
          <Box sx={{p:2}}>
            <StatusCard/>
          </Box>

      </Box>

     

    </Box>
  );
}