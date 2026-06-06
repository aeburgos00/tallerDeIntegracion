import {
  Box,
  Typography
} from "@mui/material";

import { useLocation } from "react-router-dom";

import DateFilters from "./DateFilters"
import MenuIcon from '@mui/icons-material/Menu';
import {menuAdministrador} from "./data"

export default function Navbar() {
  const location = useLocation();
  const itemSeleccionado = menuAdministrador.find((e) => e.ruta === location.pathname);
  return (
    <Box 
      sx={{
        height: 64,
        backgroundColor: "#ffffff",
        color: "#111827",
        borderBottom: "1px solid #e5e7eb",
        px: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minWidth: 0,
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
      }}
    >

      {/* IZQUIERDA */}
      <Box
      sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          minWidth: 0
      }}
      >
        <MenuIcon  sx={{
          color: "#6b7280",
          fontSize: 22,
          flexShrink: 0
        }}
        />
        <Typography
          sx={{
              fontSize: 16,
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"          
          }}
        >
          {itemSeleccionado?.descripcion}
        </Typography>
      </Box>
      
      {/* DERECHA */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          flexShrink: 0
        }}
      >
        {/* FECHA */}
        <DateFilters />
      </Box>
  
    </Box>
  );
}