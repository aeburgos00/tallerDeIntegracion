import { Outlet } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import NavbarMobile from "../components/NavbarMobile";

import logo from "../assets/LogoSinTexto.svg"

export default function MobileLayout() {

  return (
    <Box sx={{
      minHeight: "100vh",
      backgroundColor: '#F0EEE8',
      pb: 8,
    }}>

      {/* Header fijo */}
      <Box sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: "#fff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        px: 2,
        py: 1,
        height: 56,
        borderColor: "#3b82f6"
      }}>
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{
            width: 50,
            height: 50,
            objectFit: "contain",
            flexShrink: 0,
          }}
        />
        <Box>
          <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2, color: "#111827" }}>
            Ruteo y Liquidación
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#9ca3af" }}>
            Sistema Logístico
          </Typography>
        </Box>
      </Box>

      {/* Contenido — con padding top para no quedar tapado por el header */}
      <Box sx={{ pt: "56px", px: 2 }}>
        <Outlet />
      </Box>

      <NavbarMobile />

    </Box>
  );
}