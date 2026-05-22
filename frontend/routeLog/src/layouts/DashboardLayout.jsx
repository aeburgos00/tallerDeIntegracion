import { Outlet } from "react-router-dom";

import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Sidebar/>
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: '#F0EEE8'
        }}
      >
        <Navbar />
        <Box
          sx={{
            p: 1.5,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}