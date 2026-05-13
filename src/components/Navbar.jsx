import {
  Box,
  AppBar,
  Toolbar,
  Typography
} from "@mui/material";

import DateFilters from "./DateFilters"
import MenuIcon from '@mui/icons-material/Menu';
import menu from "./data"

export default function Navbar({ selectedIndex }) {
  const itemSeleccionado = menu[selectedIndex];
  return (
    <AppBar 
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "#ffffff",
        color: "#111827",
        borderBottom: "1px solid #e5e7eb"
      }}>
      <Toolbar 
      sx={{
          minHeight: "64px",
          display: "flex",
          justifyContent: "space-between"
        }}
      >
      {/* IZQUIERDA */}
      <Box
      sx={{
          display: "flex",
          alignItems: "center",
          gap: 1
      }}
      >
        <MenuIcon  sx={{
          color: "#6b7280",
          fontSize: 22
        }}/>
        <Typography
          sx={{
              fontSize: 16,
              fontWeight: 600            
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
          gap: 1.5
        }}
      >
        {/* FECHA */}
        <DateFilters />
      </Box>
  
      </Toolbar>
    </AppBar>
  );
}