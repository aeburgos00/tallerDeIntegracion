import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import NavbarMobile from "../components/NavbarMobile";

export default function MobileLayout() {

  return (
    <Box
    sx={{
      minHeight:"100vh",
      backgroundColor: '#F0EEE8',
      pb:8,
    }}
    >
      <Outlet />
      <NavbarMobile />
    </Box>
  );
}